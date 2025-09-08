
import * as admin from 'firebase-admin';

// This function ensures we only initialize the app once.
const initAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }
  
  try {
     admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
};

initAdmin();

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
