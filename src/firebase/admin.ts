
// src/firebase/admin.ts
import admin from 'firebase-admin';

// This guard prevents re-initializing the app on hot reloads.
if (!admin.apps.length) {
  try {
    // This is the recommended way for most Google Cloud environments
    // It will automatically use the service account associated with the environment.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e) {
    console.error('Failed to initialize Firebase Admin SDK:', e);
    console.log("For local development, ensure you have run 'gcloud auth application-default login' or have the GOOGLE_APPLICATION_CREDENTIALS environment variable set.");
  }
}

export const getAdminDb = () => {
    return admin.firestore();
}
