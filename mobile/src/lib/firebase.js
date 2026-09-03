import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Lưu ý: import từ `@firebase/auth` (không phải `firebase/auth`) — chỉ package
// scoped mới có điều kiện resolve "react-native" chứa `getReactNativePersistence`.
import { initializeAuth, getAuth, getReactNativePersistence } from '@firebase/auth';

// Cấu hình đọc từ mobile/.env (Expo tự nhúng biến EXPO_PUBLIC_* khi bundle).
// Web API key của Firebase là định danh công khai, không phải mật khẩu — bảo mật
// thật nằm ở firestore.rules. Vẫn để ngoài mã nguồn để đổi project không phải
// sửa code và không kích hoạt secret scanning.
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missing = ['apiKey', 'authDomain', 'projectId', 'appId'].filter((k) => !firebaseConfig[k]);
if (missing.length) {
  throw new Error(
    `Thiếu cấu hình Firebase: ${missing.join(', ')}. ` +
      'Sao chép mobile/.env.example thành mobile/.env rồi khởi động lại Metro (npx expo start -c).'
  );
}

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
