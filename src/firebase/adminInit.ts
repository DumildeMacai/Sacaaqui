'use server';

import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente do ficheiro .env
config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

function initializeAdmin() {
    // Validação robusta das credenciais
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.error("As credenciais de serviço do Firebase Admin estão em falta ou incompletas. Verifique as suas variáveis de ambiente.");
        return null;
    }

    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
        });
    } catch (error: any) {
        console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
        return null;
    }
}

const app = initializeAdmin();
const db = app ? admin.firestore() : null;

export async function getAdminDb() {
  if (!db) {
    throw new Error("O Firestore Admin não está disponível. A inicialização do Admin SDK pode ter falhado.");
  }
  return db;
}
