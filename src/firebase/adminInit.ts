'use server';

import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function initializeAdmin() {
  // Evita reinicializações
  if (admin.apps.length > 0) {
    if (!db) {
      db = admin.firestore();
    }
    return;
  }

  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      // A chave privada precisa que os `\n` literais sejam substituídos por novas linhas reais.
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    // Validação explícita das credenciais
    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
       console.error("As credenciais de serviço do Firebase Admin estão em falta ou incompletas. Verifique as suas variáveis de ambiente (.env.local).");
       return; // Sai se as credenciais estiverem incompletas
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

// Inicializa no momento em que o módulo é carregado
initializeAdmin();

export async function getAdminDb() {
  if (!db) {
    // A inicialização no nível superior falhou, não há como recuperar aqui.
    throw new Error("O Firestore Admin não está disponível. A inicialização do Admin SDK pode ter falhado. Verifique os logs do servidor para erros críticos.");
  }
  return db;
}
