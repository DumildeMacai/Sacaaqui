'use server';

import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

// Garante que as variáveis de ambiente sejam carregadas
const myEnv = config();
expand(myEnv);

function initializeAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
            console.error("As credenciais de serviço do Firebase Admin não estão completas. Verifique as variáveis de ambiente.");
            return null;
        }

        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
    } catch (error: any) {
        console.error("Erro ao inicializar o Firebase Admin SDK:", error.message);
        return null;
    }
}

const app = initializeAdmin();
export const adminDb = app ? admin.firestore() : null;
