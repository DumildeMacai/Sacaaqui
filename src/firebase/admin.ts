
import * as admin from 'firebase-admin';

const initAdmin = () => {
    // This function ensures we only initialize the app once.
    if (admin.apps.length > 0) {
        return;
    }

    try {
        // `applicationDefault` will try to find credentials from the environment.
        // This works automatically in most Google Cloud environments.
        // For local development, you need to set the GOOGLE_APPLICATION_CREDENTIALS
        // environment variable.
        admin.initializeApp({
             credential: admin.credential.applicationDefault(),
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
        console.error('Firebase Admin SDK initialization error:', error);
        // This error is critical and should be handled.
        // For now, we'll log it, but in a real app, you might want to
        // prevent the app from starting or disable features that need admin access.
    }
};

// Call initialization right away
initAdmin();

// Export a function that returns the Firestore instance
export const getAdminDb = () => {
    if (admin.apps.length === 0) {
        // This is a fallback, but initAdmin should have already run.
        initAdmin();
    }
    return admin.firestore();
};

// Export a function that returns the Auth instance
export const getAdminAuth = () => {
    if (admin.apps.length === 0) {
        initAdmin();
    }
    return admin.auth();
};
