
import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

const myEnv = config();
expand(myEnv);


console.log("Tentando inicializar o Firebase Admin SDK...");

try {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
        throw new Error("As credenciais de serviço do Firebase Admin não estão completas. Verifique as variáveis de ambiente.");
    }

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });
        console.log("Firebase Admin SDK inicializado com sucesso!");
    } else {
        console.log("Firebase Admin SDK já inicializado.");
    }
} catch (error) {
    console.error("Erro ao inicializar o Firebase Admin SDK:", error);
    // Em um ambiente de produção real, você pode querer lidar com este erro de forma mais robusta.
}

const adminDb = admin.apps.length ? admin.firestore() : null;
const adminAuth = admin.apps.lenth ? admin.auth() : null;

function getAdminDb() {
  if (!adminDb) {
    throw new Error("O Firestore Admin não está disponível. A inicialização do Admin SDK falhou.");
  }
  return adminDb;
}

export { getAdminDb, adminAuth };
