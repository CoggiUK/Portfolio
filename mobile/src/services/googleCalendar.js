import { useEffect, useMemo, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-auth-session/providers/google';
import { exchangeCodeAsync, refreshAsync, revokeAsync, ResponseType } from 'expo-auth-session';
import { Platform } from 'react-native';
import { toRFC3339, timeZone, toDate } from '../utils/date';

WebBrowser.maybeCompleteAuthSession();

const API = 'https://www.googleapis.com/calendar/v3';
const STORE_KEY = 'google-calendar-tokens';
const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly',
];

export const CLIENT_IDS = {
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined,
};

/**
 * expo-auth-session ném lỗi ngay trong lúc render khi clientId là undefined,
 * đủ để sập app. Khi chưa cấu hình OAuth ta đưa vào id giữ chỗ này để hook
 * dựng được — `connect()` vẫn từ chối dựa trên `isConfigured()`.
 */
const PLACEHOLDER_CLIENT_ID = 'unconfigured.apps.googleusercontent.com';

export const isConfigured = () =>
  Boolean(Platform.OS === 'android' ? CLIENT_IDS.android : Platform.OS === 'ios' ? CLIENT_IDS.ios : CLIENT_IDS.web);

/* ── Lưu trữ token ──────────────────────────────────────────────── */

const readTokens = async () => {
  try {
    const raw = await SecureStore.getItemAsync(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeTokens = (t) => SecureStore.setItemAsync(STORE_KEY, JSON.stringify(t));
export const clearTokens = () => SecureStore.deleteItemAsync(STORE_KEY);

const platformClientId = () =>
  Platform.OS === 'android' ? CLIENT_IDS.android : Platform.OS === 'ios' ? CLIENT_IDS.ios : CLIENT_IDS.web;

/**
 * Access token còn hạn. Tự làm mới bằng refresh_token khi sắp hết hạn.
 * Trả null nếu chưa từng kết nối hoặc refresh token đã bị thu hồi.
 */
export async function getAccessToken() {
  const t = await readTokens();
  if (!t) return null;
  if (t.accessToken && t.expiresAt && t.expiresAt - 60_000 > Date.now()) return t.accessToken;
  if (!t.refreshToken) return null;
  try {
    const fresh = await refreshAsync(
      { clientId: t.clientId || platformClientId(), refreshToken: t.refreshToken },
      Google.discovery
    );
    const next = {
      ...t,
      accessToken: fresh.accessToken,
      refreshToken: fresh.refreshToken || t.refreshToken,
      expiresAt: Date.now() + (fresh.expiresIn ?? 3600) * 1000,
    };
    await writeTokens(next);
    return next.accessToken;
  } catch (err) {
    console.warn('[gcal] refresh thất bại:', err.message);
    await clearTokens();
    return null;
  }
}

export const isConnected = async () => Boolean(await getAccessToken());

/* ── Hook đăng nhập Google ──────────────────────────────────────── */

/**
 * Dùng luồng Authorization Code + PKCE (không cần client secret) và
 * `access_type=offline` để lấy refresh_token — nhờ vậy không phải đăng
 * nhập lại mỗi giờ.
 *
 * Lưu ý: OAuth với custom scheme KHÔNG chạy trong Expo Go, cần development
 * build (`npx expo run:android`) hoặc bản build EAS.
 */
export function useGoogleAuth(onDone) {
  const [busy, setBusy] = useState(false);
  const configured = isConfigured();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: CLIENT_IDS.android || PLACEHOLDER_CLIENT_ID,
    iosClientId: CLIENT_IDS.ios || PLACEHOLDER_CLIENT_ID,
    webClientId: CLIENT_IDS.web || PLACEHOLDER_CLIENT_ID,
    clientId: CLIENT_IDS.web || PLACEHOLDER_CLIENT_ID,
    responseType: ResponseType.Code,
    scopes: SCOPES,
    shouldAutoExchangeCode: false,
    extraParams: { access_type: 'offline', prompt: 'consent' },
  });

  useEffect(() => {
    if (response?.type !== 'success' || !request) return;
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        const clientId = platformClientId() || CLIENT_IDS.web;
        const result = await exchangeCodeAsync(
          {
            clientId,
            code: response.params.code,
            redirectUri: request.redirectUri,
            extraParams: { code_verifier: request.codeVerifier || '' },
          },
          Google.discovery
        );
        await writeTokens({
          clientId,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken || null,
          expiresAt: Date.now() + (result.expiresIn ?? 3600) * 1000,
        });
        if (!cancelled) onDone?.(true, null);
      } catch (err) {
        if (!cancelled) onDone?.(false, err.message);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const connect = useCallback(async () => {
    if (!configured) {
      onDone?.(false, 'Chưa cấu hình Google OAuth Client ID (xem mobile/.env.example).');
      return;
    }
    await promptAsync();
  }, [configured, promptAsync, onDone]);

  const disconnect = useCallback(async () => {
    const t = await readTokens();
    if (t?.accessToken) {
      try {
        await revokeAsync({ token: t.accessToken, clientId: t.clientId }, Google.discovery);
      } catch {
        /* token có thể đã hết hạn — vẫn xoá local */
      }
    }
    await clearTokens();
    onDone?.(false, null);
  }, [onDone]);

  return useMemo(
    () => ({ connect, disconnect, busy, ready: configured && !!request, configured }),
    [connect, disconnect, busy, request, configured]
  );
}

/* ── Gọi Calendar API ───────────────────────────────────────────── */

async function call(path, options = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Chưa kết nối Google Calendar');
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Google API ${res.status}`);
  return json;
}

export const listCalendars = async () => {
  const data = await call('/users/me/calendarList?minAccessRole=writer');
  return (data.items || []).map((c) => ({
    id: c.id,
    name: c.summaryOverride || c.summary,
    primary: !!c.primary,
    color: c.backgroundColor,
  }));
};

/** Sự kiện app → payload Google Calendar. */
const toGoogleEvent = (ev) => {
  const start = toDate(ev.start);
  const end = toDate(ev.end) || new Date(start.getTime() + 60 * 60000);
  return {
    summary: ev.title,
    description: ev.description || undefined,
    location: ev.location || undefined,
    start: ev.allDay
      ? { date: toRFC3339(start).slice(0, 10) }
      : { dateTime: toRFC3339(start), timeZone: timeZone() },
    end: ev.allDay
      ? { date: toRFC3339(new Date(end.getTime() + 86400000)).slice(0, 10) }
      : { dateTime: toRFC3339(end), timeZone: timeZone() },
    reminders: {
      useDefault: false,
      overrides: (ev.reminders || []).map((m) => ({ method: 'popup', minutes: m })),
    },
    // Đánh dấu nguồn để lần kéo về sau không tạo bản sao.
    extendedProperties: { private: { tlwEventId: ev.id } },
  };
};

/** Đẩy 1 sự kiện lên Google. Trả về id sự kiện phía Google. */
export async function pushEvent(ev, calendarId = 'primary') {
  const body = JSON.stringify(toGoogleEvent(ev));
  if (ev.googleEventId) {
    try {
      const updated = await call(
        `/calendars/${encodeURIComponent(ev.googleCalendarId || calendarId)}/events/${ev.googleEventId}`,
        { method: 'PATCH', body }
      );
      return updated.id;
    } catch (err) {
      // Sự kiện đã bị xoá bên Google → tạo lại thay vì báo lỗi.
      if (!/404|not ?found|deleted/i.test(err.message)) throw err;
    }
  }
  const created = await call(`/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    body,
  });
  return created.id;
}

export async function deleteEvent(ev, calendarId = 'primary') {
  if (!ev.googleEventId) return;
  try {
    await call(
      `/calendars/${encodeURIComponent(ev.googleCalendarId || calendarId)}/events/${ev.googleEventId}`,
      { method: 'DELETE' }
    );
  } catch (err) {
    if (!/404|410|not ?found|deleted/i.test(err.message)) throw err;
  }
}

/** Kéo sự kiện từ Google về (bỏ qua những sự kiện chính app đã tạo). */
export async function pullEvents(calendarId = 'primary', daysBack = 7, daysAhead = 120) {
  const now = Date.now();
  const params = new URLSearchParams({
    timeMin: new Date(now - daysBack * 86400000).toISOString(),
    timeMax: new Date(now + daysAhead * 86400000).toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });
  const data = await call(`/calendars/${encodeURIComponent(calendarId)}/events?${params}`);
  return (data.items || [])
    .filter((it) => it.status !== 'cancelled')
    .map((it) => ({
      googleEventId: it.id,
      googleCalendarId: calendarId,
      appEventId: it.extendedProperties?.private?.tlwEventId || null,
      title: it.summary || '(Không tiêu đề)',
      description: it.description || '',
      location: it.location || '',
      allDay: !it.start?.dateTime,
      start: new Date(it.start?.dateTime || `${it.start?.date}T00:00:00`),
      end: new Date(it.end?.dateTime || `${it.end?.date}T00:00:00`),
    }));
}
