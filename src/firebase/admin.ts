// src/firebase/admin.ts
import admin from 'firebase-admin';

const initAdmin = () => {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        // Use application default credentials, which is the recommended way for most Google Cloud environments
        return admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    } catch (defaultError) {
        console.error("Failed to initialize Admin SDK with application default credentials.", defaultError);
        throw new Error("Could not initialize Firebase Admin SDK. For local development, ensure you have run 'gcloud auth application-default login'.");
    }
};

export const getAdminDb = () => {
    initAdmin();
    return admin.firestore();
};

export const getAdminAuth = () => {
    initAdmin();
    return admin.auth();
}
