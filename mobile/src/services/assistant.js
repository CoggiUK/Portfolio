import {
  collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';

const MESSAGES_COL = 'assistantMessages';

/**
 * Lắng nghe tin nhắn chat của trợ lý AI realtime.
 */
export function subscribeMessages(uid, onData) {
  if (!db || !uid) return () => {};
  try {
    const colRef = collection(db, 'users', uid, MESSAGES_COL);
    const q = query(colRef, orderBy('createdAt', 'asc'), limit(200));
    return onSnapshot(
      q,
      (snap) => {
        const msgs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.() || new Date(),
        }));
        onData(msgs);
      },
      (err) => console.warn('[assistant] subscribeMessages error:', err)
    );
  } catch (err) {
    console.warn('[assistant] subscribeMessages fail:', err);
    return () => {};
  }
}

/**
 * Lưu tin nhắn người dùng hoặc trợ lý vào Firestore.
 */
export async function saveMessage(uid, { role, text, action = null }) {
  if (!db || !uid) return null;
  const colRef = collection(db, 'users', uid, MESSAGES_COL);
  return addDoc(colRef, {
    role,
    text: text || '',
    action: action || null,
    createdAt: serverTimestamp(),
  });
}

/**
 * Gửi yêu cầu tới Cloud Function assistantChat (Gemini).
 */
export async function askAssistant({ message, history = [], context = {} }) {
  if (!functions) {
    throw new Error('Firebase Functions chưa được khởi tạo.');
  }
  const chatFn = httpsCallable(functions, 'assistantChat');
  const result = await chatFn({ message, history, context });
  return result.data;
}
