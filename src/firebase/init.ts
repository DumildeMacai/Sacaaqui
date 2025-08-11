// src/firebase/init.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAEC8Imf55z2TcJBLh4k01tN4ZEYA4a8S4",
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