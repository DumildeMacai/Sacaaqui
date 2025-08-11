'use server';

import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function initializeAdmin() {
  if (admin.apps.length > 0) {
    if (!db) {
      db = admin.firestore();
    }
    return;
  }

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
      console.error("As credenciais de serviço do Firebase Admin estão em falta ou incompletas. Verifique as suas variáveis de ambiente (.env).");
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    db = admin.firestore();
    console.log("Firebase Admin SDK inicializado com sucesso.");

  } catch (error: any) {
    console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
  }
}

// Chame a inicialização no nível superior para garantir que seja executada uma vez.
initializeAdmin();

export async function getAdminDb() {
  if (!db) {
    // Tenta reinicializar se a primeira tentativa falhou
    console.warn("Instância do DB não encontrada, tentando reinicializar...");
    initializeAdmin();
    if (!db) {
        throw new Error("O Firestore Admin não está disponível. A inicialização do Admin SDK pode ter falhado.");
    }
  }
  return db;
}
