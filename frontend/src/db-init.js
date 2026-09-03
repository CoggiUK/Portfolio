import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Script chạy bằng Node nên không đi qua Vite — tự đọc frontend/.env.
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Thông tin quản trị KHÔNG được hardcode — truyền qua biến môi trường:
//   ADMIN_EMAIL=ban@example.com ADMIN_PASSWORD='…' node src/db-init.js
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Thiếu cấu hình Firebase. Sao chép frontend/.env.example thành frontend/.env và điền giá trị.');
  process.exit(1);
}
if (!email || !password) {
  console.error(
    'Thiếu thông tin quản trị. Chạy lại kèm biến môi trường:\n' +
      "  ADMIN_EMAIL=ban@example.com ADMIN_PASSWORD='matkhaucuaban' node src/db-init.js"
  );
  process.exit(1);
}
if (password.length < 6) {
  console.error('ADMIN_PASSWORD cần tối thiểu 6 ký tự (yêu cầu của Firebase Auth).');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  const dbJsonPath = path.join(__dirname, '../../backend/db.json');
  const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  console.log(`Step 1: Authenticating/Creating admin user (${email})...`);
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Admin user created successfully!");
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log("Admin user already exists. Logging in...");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in as admin user successfully!");
      } catch (loginErr) {
        console.error("Login failed:", loginErr.message);
        process.exit(1);
      }
    } else if (err.code === 'auth/configuration-not-found') {
      console.warn("\n[IMPORTANT] Firebase Authentication Email/Password provider is not enabled yet.");
      console.warn("Please open your Firebase Console -> Authentication -> Sign-in method -> Add new provider -> Email/Password and enable it.");
      process.exit(1);
    } else {
      console.error("Auth creation failed:", err.message);
      process.exit(1);
    }
  }

  console.log("\nStep 2: Uploading portfolio data to Firestore...");
  try {
    // Save profile and projects
    await setDoc(doc(db, "settings", "main"), {
      profile: data.profile,
      projects: data.projects
    });
    console.log("Firestore data uploaded successfully!");
  } catch (dbErr) {
    console.error("Firestore upload failed. Note: Make sure Cloud Firestore is enabled in your Firebase Console and the Rules allow writes.", dbErr.message);
  }
  process.exit(0);
}

run();
