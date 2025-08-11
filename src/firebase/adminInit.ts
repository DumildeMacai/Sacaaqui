'use server';

import * as admin from 'firebase-admin';

function initializeAdmin() {
    // Verifica se já existe uma app inicializada para evitar erros
    if (admin.apps.length > 0) {
        return admin.app();
    }

    // Lê as credenciais diretamente das variáveis de ambiente
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
    
    // Validação robusta para garantir que as credenciais existem
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        console.error("As credenciais de serviço do Firebase Admin estão em falta ou incompletas. Verifique as suas variáveis de ambiente (.env).");
        return null;
    }

    try {
        // Inicializa a app com as credenciais
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error: any) {
        console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
        return null;
    }
}

// Garante que a inicialização acontece apenas uma vez.
const app = initializeAdmin();
const db = app ? admin.firestore() : null;

// A função exportada agora simplesmente retorna a instância do DB se ela foi criada com sucesso.
export async function getAdminDb() {
  if (!db) {
    throw new Error("O Firestore Admin não está disponível. A inicialização do Admin SDK pode ter falhado.");
  }
  return db;
}
