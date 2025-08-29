// src/firebase/init.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import admin from 'firebase-admin';

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


// Admin SDK initialization (server-side only)
const initAdmin = () => {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    
    // This requires GOOGLE_APPLICATION_CREDENTIALS to be set in the environment.
    // In a managed environment like Cloud Run, this is handled automatically.
    // For local development, you'd need to set this environment variable
    // to point to your service account key file.
    return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://atm-locator-nbjla.firebaseio.com` // Optional but good practice
    });
};

const getAdminDb = () => {
    initAdmin();
    return admin.firestore();
};

export { auth, db, getAdminDb };
