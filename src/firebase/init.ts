// src/firebase/init.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  projectId: "atm-locator-nbjla",
  appId: "1:717294013912:web:8efc3fc8530e0920c6b6ad",
  storageBucket: "atm-locator-nbjla.firebasestorage.app",
  apiKey: "AIzaSyAEC8Imf55z2TcJBLh4k01tN4ZEYA4a8S4",
  authDomain: "atm-locator-nbjla.firebaseapp.com",
  messagingSenderId: "717294013912"
};

// Client-side initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
