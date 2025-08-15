// src/firebase/init.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "atm-locator-nbjla",
  appId: "1:717294013912:web:8efc3fc8530e0920c6b6ad",
  storageBucket: "atm-locator-nbjla.firebasestorage.app",
  apiKey: "AIzaSyAEC8Imf55z2TcJBLh4k01tN4ZEYA4a8S4",
  authDomain: "atm-locator-nbjla.firebaseapp.com",
  messagingSenderId: "717294013912"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
