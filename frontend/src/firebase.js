import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzds1ECsDEFio21dKaFfXJ5gxfUXhcMwU",
  authDomain: "portfolio-42c34.firebaseapp.com",
  projectId: "portfolio-42c34",
  storageBucket: "portfolio-42c34.firebasestorage.app",
  messagingSenderId: "1098886400519",
  appId: "1:1098886400519:web:b4ad245801d323fb4038a2",
  measurementId: "G-M24PSHNJD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
