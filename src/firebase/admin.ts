// src/firebase/admin.ts
import admin from 'firebase-admin';

const initAdmin = () => {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY_JSON!);
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (e) {
        console.error("Error initializing admin SDK with service account from ENV VAR:", e);

        // Fallback for environments where the service account might be implicitly available
        try {
             return admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        } catch (defaultError) {
             console.error("Failed to initialize Admin SDK with application default credentials.", defaultError);
             throw new Error("Could not initialize Firebase Admin SDK. Service account key not found or invalid.");
        }
    }
};

export const getAdminDb = () => {
    initAdmin();
    return admin.firestore();
};
