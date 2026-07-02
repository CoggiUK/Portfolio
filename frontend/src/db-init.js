import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const firebaseConfig = {
  apiKey: "AIzaSyCzds1ECsDEFio21dKaFfXJ5gxfUXhcMwU",
  authDomain: "portfolio-42c34.firebaseapp.com",
  projectId: "portfolio-42c34",
  storageBucket: "portfolio-42c34.firebasestorage.app",
  messagingSenderId: "1098886400519",
  appId: "1:1098886400519:web:b4ad245801d323fb4038a2",
  measurementId: "G-M24PSHNJD3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const dbJsonPath = path.join(__dirname, '../../backend/db.json');
  const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  const email = "ntlam2211@gmail.com";
  const password = "adminpassword123"; 

  console.log("Step 1: Authenticating/Creating admin user...");
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
