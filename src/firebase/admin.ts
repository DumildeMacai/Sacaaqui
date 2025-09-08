
import * as admin from 'firebase-admin';

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }
    try {
        // Initialize without explicit credentials.
        // In a managed environment like Firebase/Google Cloud,
        // the SDK will automatically discover the credentials.
        return admin.initializeApp();
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        throw new Error('Failed to initialize Firebase Admin SDK. Check server logs.');
    }
}

const adminApp = initializeAdminApp();
const adminDb = admin.firestore(adminApp);
const adminAuth = admin.auth(adminApp);

export { adminDb, adminAuth };
