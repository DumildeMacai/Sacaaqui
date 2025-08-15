// src/firebase/init.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "atm-locator-nbjla.firebaseapp.com",
  projectId: "atm-locator-nbjla",
  storageBucket: "atm-locator-nbjla.firebasestorage.app",
  messagingSenderId: "717294013912",
  appId: "1:717294013912:web:b2016cf45688da0fc6b6ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
