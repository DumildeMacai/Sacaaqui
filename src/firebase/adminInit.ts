
import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
config();

console.log("Iniciando inicialização do Firebase Admin SDK..."); // Log de início

// Carregue o conteúdo da chave privada da variável de ambiente
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

console.log("FIREBASE_ADMIN_PRIVATE_KEY carregada?", !!privateKey); // Verifica se a chave privada foi carregada

// Verifique se a chave privada foi carregada
if (!privateKey) {
  console.error("FIREBASE_ADMIN_PRIVATE_KEY não está configurada nas variáveis de ambiente.");
  // Em um ambiente de produção, você pode querer adicionar um mecanismo de fallback ou sair do processo
}

// Carregue as credenciais da conta de serviço a partir da variável de ambiente
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID, // Defina esta variável de ambiente
  privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : undefined, // Substitui 
  // por quebras de linha reais, verifica se privateKey existe
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // Defina esta variável de ambiente
};

console.log("Credenciais da conta de serviço carregadas:", { // Log das credenciais carregadas (sem a chave privada completa) ...privateKey é intencional para não expor a chave completa no log
  projectId: serviceAccount.projectId,
  clientEmail: serviceAccount.clientEmail,
  privateKey: serviceAccount.privateKey ? "[Chave privada carregada]" : "[Chave privada ausente]"
});

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://atm-locator-nbjla.firebaseio.com' // Substitua pelo URL do seu projeto se necessário
    });
    console.log("Firebase Admin SDK inicializado com sucesso!"); // Log de sucesso na inicialização
  } catch (error) {
    console.error("Erro ao inicializar Firebase Admin SDK:", error); // Log de erro na inicialização
  }
} else {
  console.log("Firebase Admin SDK já inicializado, usando instância existente."); // Log se já estiver inicializado
}

/**
 * Retorna a instância do Firestore do Admin SDK.
 * Garante que o aplicativo Admin seja inicializado antes de acessar o Firestore.
 * @returns A instância do Firestore.
 */
export function getAdminDb() {
  if (admin.apps.length === 0) {
    throw new Error("Firebase Admin SDK não foi inicializado. Chame initializeApp antes de getAdminDb.");
  }
  console.log("Obtendo instância do Admin Firestore..."); // Log ao obter a instância
  return admin.firestore();
}
