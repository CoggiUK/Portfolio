import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AppState, Platform } from 'react-native';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import * as api from '../services/db';
import * as gcal from '../services/googleCalendar';
import {
  ensureChannels, requestPermission, getPushToken, syncEventReminders,
  syncHabitReminder, notifyNow,
} from '../services/notifications';
import { toDate } from '../utils/date';

const AppCtx = createContext(null);
const LAST_LEAD_KEY = 'last-seen-lead-at';

/**
 * Một nơi duy nhất giữ toàn bộ dữ liệu realtime của người dùng.
 * Tất cả collection đều nghe bằng onSnapshot nên app luôn phản chiếu
 * Firestore ngay lập tức — sửa trên web thì mobile đổi theo và ngược lại.
 */
export function AppProvider({ children }) {
  const { uid } = useAuth();

  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [habits, setHabits] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [leads, setLeads] = useState([]);
  const [site, setSite] = useState({ profile: {}, projects: [] });
  const [prefs, setPrefs] = useState({});
  const [ready, setReady] = useState(false);
  const [pushToken, setPushToken] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);

  const leadsSeen = useRef(false);
  const lastLeadAt = useRef(0);

  const notify = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ── Đăng ký các luồng realtime ──────────────────────────────── */
  useEffect(() => {
    if (!uid) {
      setEvents([]); setTasks([]); setNotes([]); setHabits([]);
      setTransactions([]); setLeads([]); setPrefs({}); setReady(false);
      leadsSeen.current = false;
      return;
    }
    const unsubs = [
      api.subscribeEvents(uid, setEvents),
      api.subscribeTasks(uid, setTasks),
      api.subscribeNotes(uid, setNotes),
      api.subscribeHabits(uid, setHabits),
      api.subscribeTransactions(uid, setTransactions),
      api.subscribePrefs(uid, setPrefs),
      api.subscribeSite(setSite),
      api.subscribeLeads(setLeads),
    ];
    setReady(true);
    return () => unsubs.forEach((u) => u?.());
  }, [uid]);

  /* ── Quyền + token push ──────────────────────────────────────── */
  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    (async () => {
      await ensureChannels();
      const granted = await requestPermission();
      if (!granted || cancelled) return;
      const token = await getPushToken();
      if (!token || cancelled) return;
      setPushToken(token);
      await api.registerDevice(uid, token, {
        platform: Platform.OS,
        deviceName: Device.deviceName || Device.modelName || 'Thiết bị',
      });
    })();
    return () => { cancelled = true; };
  }, [uid]);

  /* ── Nhắc lịch cục bộ: đặt lại mỗi khi sự kiện đổi ───────────── */
  useEffect(() => {
    if (!uid || !events.length) return;
    syncEventReminders(events).catch((e) => console.warn('[reminders]', e.message));
  }, [uid, events]);

  useEffect(() => {
    if (!uid) return;
    syncHabitReminder(
      prefs.habitReminder !== false,
      prefs.habitReminderHour ?? 20,
      prefs.habitReminderMinute ?? 0
    ).catch(() => {});
  }, [uid, prefs.habitReminder, prefs.habitReminderHour, prefs.habitReminderMinute]);

  /* ── Lead mới → thông báo ngay khi app đang chạy ─────────────── */
  useEffect(() => {
    if (!uid) return;
    (async () => {
      if (!leadsSeen.current) {
        // Lần snapshot đầu chỉ ghi mốc, tránh bắn lại toàn bộ lịch sử.
        const stored = Number((await AsyncStorage.getItem(LAST_LEAD_KEY)) || 0);
        const newest = leads.reduce((m, l) => Math.max(m, toDate(l.createdAt)?.getTime() || 0), 0);
        lastLeadAt.current = Math.max(stored, 0);
        leadsSeen.current = true;
        if (newest) await AsyncStorage.setItem(LAST_LEAD_KEY, String(newest));
        lastLeadAt.current = newest || stored;
        return;
      }
      const fresh = leads
        .filter((l) => (toDate(l.createdAt)?.getTime() || 0) > lastLeadAt.current)
        .sort((a, b) => (toDate(a.createdAt)?.getTime() || 0) - (toDate(b.createdAt)?.getTime() || 0));
      if (!fresh.length) return;
      for (const lead of fresh) {
        await notifyNow(
          `💬 ${lead.name || 'Khách'} vừa để lại liên hệ`,
          (lead.message || lead.email || '').slice(0, 140),
          { kind: 'lead', leadId: lead.id }
        );
      }
      const newest = toDate(fresh[fresh.length - 1].createdAt)?.getTime() || Date.now();
      lastLeadAt.current = newest;
      await AsyncStorage.setItem(LAST_LEAD_KEY, String(newest));
    })().catch(() => {});
  }, [uid, leads]);

  /* ── Trạng thái kết nối Google Calendar ──────────────────────── */

  // Client ID nhập trong app được đẩy xuống service để cả những hàm ngoài
  // React (làm mới access token) dùng được — không phải sửa .env rồi build lại.
  useEffect(() => {
    gcal.setClientIds(prefs.googleClientIds);
  }, [prefs.googleClientIds]);

  const refreshGoogleStatus = useCallback(async () => {
    setGoogleConnected(await gcal.isConnected());
  }, []);

  useEffect(() => {
    refreshGoogleStatus();
    const sub = AppState.addEventListener('change', (st) => {
      if (st === 'active') refreshGoogleStatus();
    });
    return () => sub.remove();
  }, [refreshGoogleStatus]);

  /* ── Đồng bộ Google Calendar ─────────────────────────────────── */

  const calendarId = prefs.googleCalendarId || 'primary';

  /** Đẩy 1 sự kiện lên Google và lưu lại id trả về. */
  const syncEventToGoogle = useCallback(
    async (event) => {
      if (!uid || !(await gcal.isConnected())) return null;
      const googleEventId = await gcal.pushEvent(event, calendarId);
      if (googleEventId && googleEventId !== event.googleEventId) {
        await api.updateItem(uid, 'events', event.id, { googleEventId, googleCalendarId: calendarId });
      }
      return googleEventId;
    },
    [uid, calendarId]
  );

  /** Đẩy tất cả sự kiện chưa có bản trên Google (hoặc vừa sửa). */
  const pushAllToGoogle = useCallback(async () => {
    if (!uid) return 0;
    let n = 0;
    for (const ev of events) {
      if (ev.source === 'google') continue;
      try {
        await syncEventToGoogle(ev);
        n += 1;
      } catch (err) {
        console.warn('[gcal push]', ev.title, err.message);
      }
    }
    return n;
  }, [uid, events, syncEventToGoogle]);

  /** Kéo sự kiện từ Google về, bỏ qua những sự kiện app đã tạo. */
  const pullFromGoogle = useCallback(async () => {
    if (!uid) return 0;
    const remote = await gcal.pullEvents(calendarId);
    const knownGoogleIds = new Set(events.map((e) => e.googleEventId).filter(Boolean));
    let n = 0;
    for (const r of remote) {
      if (r.appEventId || knownGoogleIds.has(r.googleEventId)) continue;
      await api.createItem(uid, 'events', {
        title: r.title,
        description: r.description,
        location: r.location,
        allDay: r.allDay,
        start: r.start,
        end: r.end,
        color: 'cyan',
        reminders: [15],
        source: 'google',
        googleEventId: r.googleEventId,
        googleCalendarId: r.googleCalendarId,
      });
      n += 1;
    }
    return n;
  }, [uid, calendarId, events]);

  const syncGoogle = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const pushed = await pushAllToGoogle();
      const pulled = await pullFromGoogle();
      await api.savePrefs(uid, { lastGoogleSync: Date.now() });
      notify(`Đã đồng bộ: đẩy ${pushed} · nhận ${pulled} sự kiện`, 'success');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setSyncing(false);
    }
  }, [syncing, pushAllToGoogle, pullFromGoogle, uid, notify]);

  /* ── Ghi dữ liệu (bọc thêm đồng bộ tự động) ──────────────────── */

  const saveEvent = useCallback(
    async (data, id) => {
      if (!uid) return;
      let eventId = id;
      if (id) {
        await api.updateItem(uid, 'events', id, data);
      } else {
        const ref = await api.createItem(uid, 'events', data);
        eventId = ref.id;
      }
      if (prefs.autoSyncGoogle !== false) {
        try {
          await syncEventToGoogle({ id: eventId, ...data });
        } catch (err) {
          notify(`Chưa đồng bộ được lên Google Calendar: ${err.message}`, 'error');
        }
      }
      return eventId;
    },
    [uid, prefs.autoSyncGoogle, syncEventToGoogle, notify]
  );

  const deleteEvent = useCallback(
    async (event) => {
      if (!uid) return;
      if (event.googleEventId && prefs.autoSyncGoogle !== false) {
        try {
          await gcal.deleteEvent(event, calendarId);
        } catch (err) {
          console.warn('[gcal delete]', err.message);
        }
      }
      await api.removeItem(uid, 'events', event.id);
    },
    [uid, prefs.autoSyncGoogle, calendarId]
  );

  const unreadLeads = useMemo(() => leads.filter((l) => !l.read).length, [leads]);

  const value = useMemo(
    () => ({
      uid, ready, events, tasks, notes, habits, transactions, leads, site, prefs,
      unreadLeads, pushToken, googleConnected, syncing, toast, notify,
      refreshGoogleStatus, syncGoogle, saveEvent, deleteEvent, syncEventToGoogle,
      savePrefs: (d) => api.savePrefs(uid, d),
      create: (name, data) => api.createItem(uid, name, data),
      update: (name, id, data) => api.updateItem(uid, name, id, data),
      remove: (name, id) => api.removeItem(uid, name, id),
      api,
    }),
    [
      uid, ready, events, tasks, notes, habits, transactions, leads, site, prefs,
      unreadLeads, pushToken, googleConnected, syncing, toast, notify,
      refreshGoogleStatus, syncGoogle, saveEvent, deleteEvent, syncEventToGoogle,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp phải nằm trong <AppProvider>');
  return ctx;
};
