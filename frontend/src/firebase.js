import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Cấu hình đọc từ biến môi trường (xem .env.example). Web API key của Firebase
// vốn là định danh công khai — bảo mật thật nằm ở Firestore Rules và ở phần
// giới hạn HTTP referrer của key trên Google Cloud Console — nhưng để key ngoài
// mã nguồn giúp đổi project không phải sửa code và không kích hoạt cảnh báo
// secret scanning của GitHub.
const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const missing = ["apiKey", "authDomain", "projectId", "appId"].filter((k) => !firebaseConfig[k]);
if (missing.length) {
  throw new Error(
    `Thiếu cấu hình Firebase: ${missing.join(", ")}. ` +
      `Sao chép frontend/.env.example thành frontend/.env và điền giá trị từ Firebase Console.`
  );
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
