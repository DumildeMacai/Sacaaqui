
import * as admin from 'firebase-admin';

// This function initializes and returns a Firebase Admin App instance.
// It ensures that initialization only happens once.
function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        // When deployed to Google Cloud environments, the SDK automatically
        // discovers the service account credentials.
        return admin.initializeApp();
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        throw new Error('Failed to initialize Firebase Admin SDK. Check server logs.');
    }
}

// Get the initialized Firebase Admin App
const adminApp = initializeAdminApp();

// Get a Firestore instance from the Admin App
const adminDb = admin.firestore(adminApp);

// Export a function to get the pre-initialized DB instance
export function getAdminDb() {
    return adminDb;
}
