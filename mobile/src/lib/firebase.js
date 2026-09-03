import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Lưu ý: import từ `@firebase/auth` (không phải `firebase/auth`) — chỉ package
// scoped mới có điều kiện resolve "react-native" chứa `getReactNativePersistence`.
import { initializeAuth, getAuth, getReactNativePersistence } from '@firebase/auth';

const env = process.env;

export const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCzds1ECsDEFio21dKaFfXJ5gxfUXhcMwU',
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'portfolio-42c34.firebaseapp.com',
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'portfolio-42c34',
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'portfolio-42c34.firebasestorage.app',
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1098886400519',
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:1098886400519:web:b4ad245801d323fb4038a2',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth ném lỗi nếu đã khởi tạo (Fast Refresh) → rơi về getAuth.
let _auth;
try {
  _auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  _auth = getAuth(app);
}

export const auth = _auth;
export const db = getFirestore(app);
export default app;
