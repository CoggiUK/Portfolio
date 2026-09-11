import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc, getDoc, getDocs,
  onSnapshot, query, orderBy, where, limit, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/*
 * Sơ đồ dữ liệu Firestore
 * ───────────────────────
 * settings/main                      Nội dung website (profile + projects) — dùng chung với web
 * leads/{leadId}                     Người lạ để lại liên hệ trên web (web ghi ẩn danh)
 * users/{uid}/events/{id}            Lịch làm việc  ⟷ Google Calendar
 * users/{uid}/tasks/{id}             Công việc / todo
 * users/{uid}/notes/{id}             Ghi chú nhanh
 * users/{uid}/habits/{id}            Thói quen (kèm map history: 'YYYY-MM-DD' → true)
 * users/{uid}/transactions/{id}      Thu / chi cá nhân
 * users/{uid}/devices/{pushToken}    Thiết bị nhận push (Cloud Functions đọc)
 * users/{uid}/meta/prefs             Tuỳ chọn cá nhân (auto-sync, giờ nhắc mặc định…)
 */

export const userCol = (uid, name) => (db ? collection(db, 'users', uid, name) : null);
export const userDoc = (uid, name, id) => (db ? doc(db, 'users', uid, name, id) : null);
export const prefsRef = (uid) => (db ? doc(db, 'users', uid, 'meta', 'prefs') : null);
export const leadsCol = () => (db ? collection(db, 'leads') : null);
export const siteRef = () => (db ? doc(db, 'settings', 'main') : null);

/** Đăng ký lắng nghe realtime một collection con của user. */
export const subscribe = (uid, name, onData, constraints = []) => {
  if (!db) return () => {};
  try {
    const col = userCol(uid, name);
    if (!col) return () => {};
    return onSnapshot(
      query(col, ...constraints),
      (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn(`[db] subscribe ${name}:`, err.message)
    );
  } catch (err) {
    console.warn(`[db] subscribe ${name} error:`, err);
    return () => {};
  }
};

export const createItem = (uid, name, data) =>
  addDoc(userCol(uid, name), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

export const updateItem = (uid, name, id, data) =>
  updateDoc(userDoc(uid, name, id), { ...data, updatedAt: serverTimestamp() });

export const removeItem = (uid, name, id) => deleteDoc(userDoc(uid, name, id));

/* ── Sự kiện / lịch ─────────────────────────────────────────────── */

export const subscribeEvents = (uid, cb) => subscribe(uid, 'events', cb, [orderBy('start', 'asc')]);

/* ── Công việc ──────────────────────────────────────────────────── */

export const subscribeTasks = (uid, cb) => subscribe(uid, 'tasks', cb, [orderBy('createdAt', 'desc')]);

export const toggleTask = (uid, task) =>
  updateItem(uid, 'tasks', task.id, {
    done: !task.done,
    doneAt: task.done ? null : serverTimestamp(),
  });

/* ── Ghi chú ────────────────────────────────────────────────────── */

export const subscribeNotes = (uid, cb) => subscribe(uid, 'notes', cb, [orderBy('updatedAt', 'desc')]);

/* ── Thói quen ──────────────────────────────────────────────────── */

export const subscribeHabits = (uid, cb) => subscribe(uid, 'habits', cb, [orderBy('createdAt', 'asc')]);

/** Bật/tắt một ngày trong lịch sử thói quen. Dùng dot-path để chỉ ghi đúng 1 field. */
export const toggleHabitDay = (uid, habit, key) => {
  const on = !!habit.history?.[key];
  return updateDoc(userDoc(uid, 'habits', habit.id), {
    [`history.${key}`]: on ? null : true,
    updatedAt: serverTimestamp(),
  });
};

/* ── Chi tiêu ───────────────────────────────────────────────────── */

export const subscribeTransactions = (uid, cb) =>
  subscribe(uid, 'transactions', cb, [orderBy('date', 'desc'), limit(500)]);

/* ── Liên hệ từ website ─────────────────────────────────────────── */

export const subscribeLeads = (cb) => {
  if (!db) return () => {};
  try {
    const col = leadsCol();
    if (!col) return () => {};
    return onSnapshot(
      query(col, orderBy('createdAt', 'desc'), limit(200)),
      (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn('[db] subscribe leads:', err.message)
    );
  } catch (err) {
    console.warn('[db] subscribe leads error:', err);
    return () => {};
  }
};

export const updateLead = (id, data) => (db ? updateDoc(doc(db, 'leads', id), data) : Promise.resolve());
export const removeLead = (id) => (db ? deleteDoc(doc(db, 'leads', id)) : Promise.resolve());

export const markLeadsRead = async (leads) => {
  if (!db) return;
  const unread = leads.filter((l) => !l.read).slice(0, 400);
  if (!unread.length) return;
  try {
    const batch = writeBatch(db);
    unread.forEach((l) => batch.update(doc(db, 'leads', l.id), { read: true }));
    await batch.commit();
  } catch (err) {
    console.warn('[db] markLeadsRead error:', err);
  }
};

/* ── Nội dung website ───────────────────────────────────────────── */

export const subscribeSite = (cb) => {
  if (!db) return () => {};
  try {
    const ref = siteRef();
    if (!ref) return () => {};
    return onSnapshot(
      ref,
      (snap) => cb(snap.exists() ? snap.data() : { profile: {}, projects: [] }),
      (err) => console.warn('[db] subscribe site:', err.message)
    );
  } catch (err) {
    console.warn('[db] subscribe site error:', err);
    return () => {};
  }
};

export const saveSiteProfile = (profile) => (siteRef() ? setDoc(siteRef(), { profile }, { merge: true }) : Promise.resolve());
export const saveSiteProjects = (projects) => (siteRef() ? setDoc(siteRef(), { projects }, { merge: true }) : Promise.resolve());

/* ── Thiết bị nhận push ─────────────────────────────────────────── */

export const registerDevice = (uid, token, info) =>
  (db ? setDoc(doc(db, 'users', uid, 'devices', token), { token, ...info, updatedAt: serverTimestamp() }) : Promise.resolve());

export const unregisterDevice = (uid, token) => (db ? deleteDoc(doc(db, 'users', uid, 'devices', token)) : Promise.resolve());

/* ── Tuỳ chọn ───────────────────────────────────────────────────── */

export const subscribePrefs = (uid, cb) => {
  if (!db) return () => {};
  try {
    const ref = prefsRef(uid);
    if (!ref) return () => {};
    return onSnapshot(ref, (snap) => cb(snap.exists() ? snap.data() : {}), () => cb({}));
  } catch (err) {
    console.warn('[db] subscribe prefs error:', err);
    return () => {};
  }
};

export const savePrefs = (uid, data) => (prefsRef(uid) ? setDoc(prefsRef(uid), data, { merge: true }) : Promise.resolve());

export { serverTimestamp, getDoc, getDocs, doc, collection, query, where, orderBy, limit };
