'use server';

import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente do ficheiro .env
config();

// Verifica se já existe uma app inicializada para evitar erros
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // Validação robusta das credenciais
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
      throw new Error("As credenciais de serviço do Firebase Admin estão em falta ou incompletas. Verifique as suas variáveis de ambiente.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
     console.log("Firebase Admin SDK inicializado com sucesso.");
  } catch (error: any) {
    console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
    // Em caso de falha na inicialização, as chamadas subsequentes ao db falharão.
  }
}

// Exporta a instância do Firestore
const db = admin.firestore();

export async function getAdminDb() {
  if (!db) {
    // Este erro agora só deve ocorrer se a inicialização acima falhar criticamente.
    throw new Error("O Firestore Admin não está disponível. A inicialização do Admin SDK pode ter falhado.");
  }
  return db;
}
