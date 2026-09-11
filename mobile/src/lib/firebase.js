import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Lưu ý: import từ `@firebase/auth` (không phải `firebase/auth`) — chỉ package
// scoped mới có điều kiện resolve "react-native" chứa `getReactNativePersistence`.
import { initializeAuth, getAuth, getReactNativePersistence } from '@firebase/auth';

// Cấu hình đọc từ mobile/.env (Expo tự nhúng biến EXPO_PUBLIC_* khi bundle).
// Web API key của Firebase là định danh công khai, không phải mật khẩu — bảo mật
// thật nằm ở firestore.rules. Vẫn để ngoài mã nguồn để đổi project không phải
// sửa code và không kích hoạt secret scanning.
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCzds1ECsDEFio21dKaFfXJ5gxfUXhcMwU',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'portfolio-42c34.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'portfolio-42c34',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'portfolio-42c34.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1098886400519',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:1098886400519:web:b4ad245801d323fb4038a2',
};

let app = null;
let auth = null;
let db = null;
let functions = null;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    auth = getAuth(app);
  }
  db = getFirestore(app);
  try {
    functions = getFunctions(app, 'asia-southeast1');
  } catch (fnErr) {
    console.warn('[Firebase] Functions init error:', fnErr);
  }
} catch (err) {
  console.warn('[Firebase] Init error:', err);
}

export { auth, db, functions };
export default app;
