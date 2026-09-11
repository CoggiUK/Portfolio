import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { colors } from '../theme';
import { toDate, fmtTime } from '../utils/date';

const DATE_TRIGGER = Notifications?.SchedulableTriggerInputTypes?.DATE ?? 'date';
const DAILY_TRIGGER = Notifications?.SchedulableTriggerInputTypes?.DAILY ?? 'daily';

// Thông báo luôn hiện kể cả khi app đang mở (mặc định của expo là ẩn).
try {
  if (Notifications?.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
} catch (err) {
  console.warn('[notifications] setNotificationHandler error:', err);
}

export const CHANNELS = {
  default: 'default',
  leads: 'leads',
  reminders: 'reminders',
};

/** Android bắt buộc có channel thì thông báo mới kêu/rung đúng mức ưu tiên. */
export async function ensureChannels() {
  if (Platform.OS !== 'android') return;
  try {
    if (!Notifications?.setNotificationChannelAsync) return;
    const defaultImp = Notifications?.AndroidImportance?.DEFAULT ?? 3;
    const maxImp = Notifications?.AndroidImportance?.MAX ?? 5;
    const highImp = Notifications?.AndroidImportance?.HIGH ?? 4;

    await Notifications.setNotificationChannelAsync(CHANNELS.default, {
      name: 'Chung',
      importance: defaultImp,
      lightColor: colors.primary,
    });
    await Notifications.setNotificationChannelAsync(CHANNELS.leads, {
      name: 'Liên hệ mới',
      importance: maxImp,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.primary,
      sound: 'default',
    });
    await Notifications.setNotificationChannelAsync(CHANNELS.reminders, {
      name: 'Nhắc lịch',
      importance: highImp,
      vibrationPattern: [0, 200, 150, 200],
      lightColor: colors.cyan,
      sound: 'default',
    });
  } catch (err) {
    console.warn('[notifications] ensureChannels error:', err);
  }
}

export async function requestPermission() {
  try {
    if (!Notifications?.getPermissionsAsync) return false;
    const current = await Notifications.getPermissionsAsync();
    if (current?.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return asked?.granted || asked?.ios?.status === Notifications?.IosAuthorizationStatus?.PROVISIONAL;
  } catch (err) {
    console.warn('[notifications] requestPermission error:', err);
    return false;
  }
}

/**
 * Lấy Expo push token để Cloud Functions gửi thông báo khi app đã đóng.
 * Trả về null trên máy ảo hoặc khi chưa cấu hình EAS projectId.
 */
export async function getPushToken() {
  if (!Device.isDevice) return null;
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId || null;
  if (!projectId) {
    console.warn('[push] Chưa có EAS projectId — chạy `npx eas init` trong thư mục mobile/.');
    return null;
  }
  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return data;
  } catch (err) {
    console.warn('[push] Không lấy được token:', err.message);
    return null;
  }
}

/* ── Nhắc lịch cục bộ ───────────────────────────────────────────────
 * Chạy hoàn toàn trên máy nên vẫn nhắc đúng giờ kể cả khi mất mạng hay
 * chưa bật Cloud Functions. Cloud Functions là lớp dự phòng thứ hai.
 */

const EVENT_KIND = 'event-reminder';

export const DEFAULT_REMINDERS = [15];

export const REMINDER_CHOICES = [
  { value: 0, label: 'Đúng giờ' },
  { value: 5, label: '5 phút' },
  { value: 15, label: '15 phút' },
  { value: 30, label: '30 phút' },
  { value: 60, label: '1 giờ' },
  { value: 120, label: '2 giờ' },
  { value: 1440, label: '1 ngày' },
];

const offsetLabel = (m) =>
  (REMINDER_CHOICES.find((c) => c.value === m)?.label || `${m} phút`).toLowerCase();

/**
 * Đặt lại toàn bộ nhắc lịch từ danh sách sự kiện hiện tại.
 * Huỷ sạch các thông báo `event-reminder` cũ rồi lên lịch lại — nhờ vậy
 * sửa/xoá sự kiện luôn phản ánh đúng, không cần theo dõi từng id.
 */
export async function syncEventReminders(events) {
  try {
    if (!Notifications?.getAllScheduledNotificationsAsync || !Notifications?.scheduleNotificationAsync) return 0;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => n.content?.data?.kind === EVENT_KIND)
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
    );

    const now = Date.now();
    let count = 0;
    for (const ev of events || []) {
      const start = toDate(ev.start);
      if (!start) continue;
      const offsets = ev.reminders?.length ? ev.reminders : DEFAULT_REMINDERS;
      for (const mins of offsets) {
        const at = new Date(start.getTime() - mins * 60000);
        if (at.getTime() <= now + 5000 || count >= 200) continue;
        await Notifications.scheduleNotificationAsync({
          content: {
            title: mins === 0 ? `⏰ ${ev.title}` : `⏰ Sắp đến lịch · ${offsetLabel(mins)} nữa`,
            body:
              mins === 0
                ? `Bắt đầu ngay bây giờ${ev.location ? ` · ${ev.location}` : ''}`
                : `${ev.title} — ${fmtTime(start)}${ev.location ? ` · ${ev.location}` : ''}`,
            data: { kind: EVENT_KIND, eventId: ev.id },
            sound: 'default',
            ...(Platform.OS === 'android' ? { channelId: CHANNELS.reminders } : {}),
          },
          trigger: { type: DATE_TRIGGER, date: at, channelId: CHANNELS.reminders },
        }).catch(() => {});
        count += 1;
      }
    }
    return count;
  } catch (err) {
    console.warn('[notifications] syncEventReminders error:', err);
    return 0;
  }
}

/* ── Nhắc thói quen hằng ngày ───────────────────────────────────── */

const HABIT_KIND = 'habit-reminder';

export async function syncHabitReminder(enabled, hour = 20, minute = 0) {
  try {
    if (!Notifications?.getAllScheduledNotificationsAsync || !Notifications?.scheduleNotificationAsync) return;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((n) => n.content?.data?.kind === HABIT_KIND)
        .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
    );
    if (!enabled) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌱 Điểm danh thói quen',
        body: 'Dành 30 giây tổng kết ngày hôm nay nhé.',
        data: { kind: HABIT_KIND },
        ...(Platform.OS === 'android' ? { channelId: CHANNELS.reminders } : {}),
      },
      trigger: { type: DAILY_TRIGGER, hour, minute, channelId: CHANNELS.reminders },
    }).catch(() => {});
  } catch (err) {
    console.warn('[notifications] syncHabitReminder error:', err);
  }
}

/** Thông báo ngay lập tức — dùng cho lead mới khi app đang chạy. */
export async function notifyNow(title, body, data = {}, channel = CHANNELS.leads) {
  try {
    if (!Notifications?.scheduleNotificationAsync) return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        ...(Platform.OS === 'android' ? { channelId: channel } : {}),
      },
      trigger: null,
    }).catch(() => {});
  } catch (err) {
    console.warn('[notifications] notifyNow error:', err);
  }
}

export { Notifications };
