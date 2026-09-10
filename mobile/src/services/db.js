import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc, getDoc, getDocs,
  onSnapshot, query, orderBy, where, limit, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { encryptData, decryptData } from './crypto';

/*
 * Sơ đồ dữ liệu Firestore
 * ───────────────────────
 * settings/main                      Nội dung website (profile + projects) — dùng chung với web
 * leads/{leadId}                     Người lạ để lại liên hệ trên web (web ghi ẩn danh)
 * users/{uid}/events/{id}            Lịch làm việc  ⟷ Google Calendar (mã hóa)
 * users/{uid}/tasks/{id}             Công việc / todo (mã hóa)
 * users/{uid}/notes/{id}             Ghi chú nhanh (mã hóa)
 * users/{uid}/habits/{id}            Thói quen (mã hóa)
 * users/{uid}/transactions/{id}      Thu / chi cá nhân (mã hóa)
 * users/{uid}/devices/{pushToken}    Thiết bị nhận push (Cloud Functions đọc)
 * users/{uid}/meta/prefs             Tuỳ chọn cá nhân (auto-sync, giờ nhắc mặc định…)
 */

export const userCol = (uid, name) => collection(db, 'users', uid, name);
export const userDoc = (uid, name, id) => doc(db, 'users', uid, name, id);
export const prefsRef = (uid) => doc(db, 'users', uid, 'meta', 'prefs');
export const leadsCol = () => collection(db, 'leads');
export const siteRef = () => doc(db, 'settings', 'main');

/** Đăng ký lắng nghe realtime một collection con của user (tự động giải mã). */
export const subscribe = (uid, name, onData, constraints = []) =>
  onSnapshot(
    query(userCol(uid, name), ...constraints),
    async (snap) => {
      try {
        const decryptedItems = await Promise.all(
          snap.docs.map(async (d) => {
            const raw = d.data();
            const decrypted = await decryptData(raw, uid);
            return { id: d.id, ...decrypted };
          })
        );
        onData(decryptedItems);
      } catch (err) {
        console.warn(`[db] Decrypt error in ${name}:`, err.message);
        onData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    },
    (err) => console.warn(`[db] subscribe ${name}:`, err.message)
  );

export const createItem = async (uid, name, data) => {
  const encPayload = await encryptData(data, uid);
  return addDoc(userCol(uid, name), {
    ...encPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateItem = async (uid, name, id, data) => {
  const encPayload = await encryptData(data, uid);
  return updateDoc(userDoc(uid, name, id), {
    ...encPayload,
    updatedAt: serverTimestamp(),
  });
};

export const removeItem = (uid, name, id) => deleteDoc(userDoc(uid, name, id));

/**
 * Xóa sạch toàn bộ dữ liệu cá nhân của người dùng trên Cloud Firestore
 */
export const clearAllUserData = async (uid) => {
  if (!uid) return;
  const collections = ['events', 'tasks', 'notes', 'habits', 'transactions'];
  for (const colName of collections) {
    try {
      const snap = await getDocs(userCol(uid, colName));
      if (!snap.empty) {
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    } catch (err) {
      console.warn(`[db] clearAllUserData error on ${colName}:`, err.message);
    }
  }
};

/* ── Sự kiện / lịch ─────────────────────────────────────────────── */

export const subscribeEvents = (uid, cb) => subscribe(uid, 'events', cb, [orderBy('createdAt', 'desc')]);

/* ── Công việc ──────────────────────────────────────────────────── */

export const subscribeTasks = (uid, cb) => subscribe(uid, 'tasks', cb, [orderBy('createdAt', 'desc')]);

export const toggleTask = (uid, task) =>
  updateItem(uid, 'tasks', task.id, {
    ...task,
    done: !task.done,
    doneAt: task.done ? null : serverTimestamp(),
  });

/* ── Ghi chú ────────────────────────────────────────────────────── */

export const subscribeNotes = (uid, cb) => subscribe(uid, 'notes', cb, [orderBy('createdAt', 'desc')]);

/* ── Thói quen ──────────────────────────────────────────────────── */

export const subscribeHabits = (uid, cb) => subscribe(uid, 'habits', cb, [orderBy('createdAt', 'asc')]);

/** Bật/tắt một ngày trong lịch sử thói quen (bảo vệ lịch sử bằng mã hóa). */
export const toggleHabitDay = (uid, habit, key) => {
  const nextHistory = { ...(habit.history || {}) };
  if (nextHistory[key]) {
    delete nextHistory[key];
  } else {
    nextHistory[key] = true;
  }
  return updateItem(uid, 'habits', habit.id, {
    ...habit,
    history: nextHistory,
  });
};

/* ── Chi tiêu ───────────────────────────────────────────────────── */

export const subscribeTransactions = (uid, cb) =>
  subscribe(uid, 'transactions', cb, [orderBy('date', 'desc'), limit(500)]);

/* ── Liên hệ từ website ─────────────────────────────────────────── */

export const subscribeLeads = (cb) =>
  onSnapshot(
    query(leadsCol(), orderBy('createdAt', 'desc'), limit(200)),
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => console.warn('[db] subscribe leads:', err.message)
  );

export const updateLead = (id, data) => updateDoc(doc(db, 'leads', id), data);
export const removeLead = (id) => deleteDoc(doc(db, 'leads', id));

export const markLeadsRead = async (leads) => {
  const unread = leads.filter((l) => !l.read).slice(0, 400);
  if (!unread.length) return;
  const batch = writeBatch(db);
  unread.forEach((l) => batch.update(doc(db, 'leads', l.id), { read: true }));
  await batch.commit();
};

/* ── Nội dung website ───────────────────────────────────────────── */

export const subscribeSite = (cb) =>
  onSnapshot(
    siteRef(),
    (snap) => cb(snap.exists() ? snap.data() : { profile: {}, projects: [] }),
    (err) => console.warn('[db] subscribe site:', err.message)
  );

export const saveSiteProfile = (profile) => setDoc(siteRef(), { profile }, { merge: true });
export const saveSiteProjects = (projects) => setDoc(siteRef(), { projects }, { merge: true });

/* ── Thiết bị nhận push ─────────────────────────────────────────── */

export const registerDevice = (uid, token, info) =>
  setDoc(doc(db, 'users', uid, 'devices', token), { token, ...info, updatedAt: serverTimestamp() });

export const unregisterDevice = (uid, token) => deleteDoc(doc(db, 'users', uid, 'devices', token));

/* ── Tuỳ chọn ───────────────────────────────────────────────────── */

export const subscribePrefs = (uid, cb) =>
  onSnapshot(prefsRef(uid), (snap) => cb(snap.exists() ? snap.data() : {}), () => cb({}));

export const savePrefs = (uid, data) => setDoc(prefsRef(uid), data, { merge: true });

export { serverTimestamp, getDoc, getDocs, doc, collection, query, where, orderBy, limit };
