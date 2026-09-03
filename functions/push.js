import { Expo } from 'expo-server-sdk';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

const expo = new Expo();

/**
 * Lấy toàn bộ Expo push token của một user (mỗi thiết bị là một document).
 * Truyền `uid = null` để lấy token của mọi user — dùng cho lead vì lead nằm
 * ở collection gốc, không thuộc user nào.
 */
export async function tokensFor(uid) {
  const db = getFirestore();
  const snap = uid
    ? await db.collection('users').doc(uid).collection('devices').get()
    : await db.collectionGroup('devices').get();

  return snap.docs
    .map((d) => d.get('token') || d.id)
    .filter((t) => Expo.isExpoPushToken(t));
}

/**
 * Gửi push qua Expo và dọn các token đã hỏng (thiết bị gỡ app / đổi máy).
 * Trả về số thông báo gửi thành công.
 */
export async function sendPush(tokens, message) {
  if (!tokens.length) {
    logger.info('[push] không có thiết bị nào đăng ký');
    return 0;
  }

  const chunks = expo.chunkPushNotifications(
    tokens.map((to) => ({ to, sound: 'default', priority: 'high', ...message }))
  );

  let sent = 0;
  const invalid = [];
  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      tickets.forEach((ticket, i) => {
        if (ticket.status === 'ok') sent += 1;
        else if (ticket.details?.error === 'DeviceNotRegistered') invalid.push(chunk[i].to);
        else logger.warn('[push] ticket lỗi', ticket);
      });
    } catch (err) {
      logger.error('[push] gửi thất bại', err);
    }
  }

  if (invalid.length) await pruneTokens(invalid);
  return sent;
}

async function pruneTokens(tokens) {
  const db = getFirestore();
  const snap = await db.collectionGroup('devices').get();
  const batch = db.batch();
  let n = 0;
  snap.docs.forEach((d) => {
    if (tokens.includes(d.get('token') || d.id)) {
      batch.delete(d.ref);
      n += 1;
    }
  });
  if (n) {
    await batch.commit();
    logger.info(`[push] đã xoá ${n} token hỏng`);
  }
}
