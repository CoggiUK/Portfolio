import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { setGlobalOptions } from 'firebase-functions/v2';
import { logger } from 'firebase-functions';
import { tokensFor, sendPush } from './push.js';

initializeApp();
setGlobalOptions({ region: 'asia-southeast1', maxInstances: 5 });

const TZ = 'Asia/Ho_Chi_Minh';

/* ────────────────────────────────────────────────────────────────
 * 1. Có người để lại liên hệ trên website → push ngay lập tức
 * ──────────────────────────────────────────────────────────────── */

export const onLeadCreated = onDocumentCreated('leads/{leadId}', async (event) => {
  const lead = event.data?.data();
  if (!lead) return;

  const tokens = await tokensFor(null);
  const sent = await sendPush(tokens, {
    title: `💬 ${lead.name || 'Khách'} vừa để lại liên hệ`,
    body: (lead.message || lead.email || 'Mở app để xem chi tiết').slice(0, 160),
    data: { kind: 'lead', leadId: event.params.leadId },
    channelId: 'leads',
    badge: 1,
  });
  logger.info(`[lead] ${event.params.leadId} → đã push tới ${sent}/${tokens.length} thiết bị`);
});

/* ────────────────────────────────────────────────────────────────
 * 2. Nhắc lịch — chạy mỗi 5 phút, bắn đúng mốc "nhắc trước N phút"
 *
 * App đã tự đặt thông báo cục bộ; hàm này là lớp dự phòng cho trường
 * hợp máy khởi động lại, hệ điều hành xoá alarm, hoặc lịch được tạo
 * từ thiết bị khác.
 * ──────────────────────────────────────────────────────────────── */

const WINDOW_MS = 6 * 60 * 1000; // nới hơn chu kỳ 5 phút để không bỏ sót
const MAX_LOOKAHEAD_MS = 25 * 60 * 60 * 1000; // mốc nhắc xa nhất là 1 ngày

export const eventReminders = onSchedule(
  { schedule: 'every 5 minutes', timeZone: TZ },
  async () => {
    const db = getFirestore();
    const now = Date.now();

    const snap = await db
      .collectionGroup('events')
      .where('start', '>=', new Date(now))
      .where('start', '<=', new Date(now + MAX_LOOKAHEAD_MS))
      .get();

    for (const doc of snap.docs) {
      const ev = doc.data();
      const start = ev.start?.toDate?.();
      if (!start) continue;

      const offsets = Array.isArray(ev.reminders) && ev.reminders.length ? ev.reminders : [15];
      const notified = Array.isArray(ev.notified) ? ev.notified : [];
      const due = offsets.filter((m) => {
        const fireAt = start.getTime() - m * 60000;
        return !notified.includes(m) && fireAt <= now && fireAt > now - WINDOW_MS;
      });
      if (!due.length) continue;

      // users/{uid}/events/{eventId} → lùi 2 cấp để lấy uid.
      const uid = doc.ref.parent.parent?.id;
      if (!uid) continue;

      const minutes = Math.min(...due);
      const when = minutes === 0
        ? 'Bắt đầu ngay bây giờ'
        : minutes >= 60
          ? `Còn ${Math.round(minutes / 60)} giờ nữa`
          : `Còn ${minutes} phút nữa`;

      const tokens = await tokensFor(uid);
      await sendPush(tokens, {
        title: `⏰ ${ev.title}`,
        body: `${when}${ev.location ? ` · ${ev.location}` : ''}`,
        data: { kind: 'event-reminder', eventId: doc.id },
        channelId: 'reminders',
      });

      await doc.ref.update({ notified: FieldValue.arrayUnion(...due) });
      logger.info(`[reminder] ${ev.title} → nhắc trước ${due.join(', ')} phút`);
    }
  }
);

/* ────────────────────────────────────────────────────────────────
 * 3. Tóm tắt buổi sáng — 7h mỗi ngày
 * ──────────────────────────────────────────────────────────────── */

export const dailyDigest = onSchedule(
  { schedule: '0 7 * * *', timeZone: TZ },
  async () => {
    const db = getFirestore();
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayEnd = new Date(dayStart.getTime() + 86400000);

    const users = await db.collection('users').listDocuments();
    for (const userRef of users) {
      const [eventsSnap, tasksSnap, leadsSnap] = await Promise.all([
        userRef.collection('events').where('start', '>=', dayStart).where('start', '<', dayEnd).get(),
        userRef.collection('tasks').where('done', '==', false).get(),
        db.collection('leads').where('read', '==', false).get(),
      ]);

      const dueToday = tasksSnap.docs.filter((d) => {
        const due = d.get('due')?.toDate?.();
        return due && due < dayEnd;
      }).length;

      if (!eventsSnap.size && !dueToday && !leadsSnap.size) continue;

      const parts = [];
      if (eventsSnap.size) parts.push(`${eventsSnap.size} lịch`);
      if (dueToday) parts.push(`${dueToday} việc đến hạn`);
      if (leadsSnap.size) parts.push(`${leadsSnap.size} liên hệ chưa đọc`);

      const first = eventsSnap.docs
        .map((d) => ({ title: d.get('title'), start: d.get('start')?.toDate?.() }))
        .filter((e) => e.start)
        .sort((a, b) => a.start - b.start)[0];

      const tokens = await tokensFor(userRef.id);
      await sendPush(tokens, {
        title: '☀️ Hôm nay của bạn',
        body: `${parts.join(' · ')}${first ? `. Sớm nhất: ${first.title}` : ''}`,
        data: { kind: 'digest' },
        channelId: 'default',
      });
    }
  }
);

/* ────────────────────────────────────────────────────────────────
 * 4. Dọn cờ `notified` của sự kiện đã qua để lần lặp sau không phình
 * ──────────────────────────────────────────────────────────────── */

export const cleanupReminders = onSchedule(
  { schedule: '0 3 * * *', timeZone: TZ },
  async () => {
    const db = getFirestore();
    const cutoff = new Date(Date.now() - 7 * 86400000);
    const snap = await db.collectionGroup('events').where('start', '<', cutoff).get();
    const stale = snap.docs.filter((d) => Array.isArray(d.get('notified')) && d.get('notified').length);
    if (!stale.length) return;

    const batch = db.batch();
    stale.forEach((d) => batch.update(d.ref, { notified: FieldValue.delete() }));
    await batch.commit();
    logger.info(`[cleanup] dọn cờ nhắc của ${stale.length} sự kiện cũ`);
  }
);
