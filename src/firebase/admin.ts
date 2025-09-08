
import * as admin from 'firebase-admin';

// Função para garantir que a inicialização do SDK Admin ocorra apenas uma vez.
function initializeAdminApp() {
    // Se a aplicação já estiver inicializada, retorna a aplicação existente.
    if (admin.apps.length > 0) {
        return admin.app();
    }

    try {
        // Caso contrário, inicializa uma nova aplicação.
        // A configuração `credential: admin.credential.applicationDefault()` é usada
        // para que o SDK possa encontrar automaticamente as credenciais do ambiente
        // quando executado em infraestrutura Google Cloud (como o App Hosting).
        return admin.initializeApp();
    } catch (error) {
        console.error('Firebase admin initialization error', error);
        // Lança um erro claro se a inicialização falhar.
        throw new Error('Failed to initialize Firebase Admin SDK. Check server logs.');
    }
}

// Garante que a aplicação seja inicializada ao carregar este módulo.
initializeAdminApp();

// Exporta uma função que retorna os serviços de admin necessários.
// Isto garante que qualquer parte da aplicação que importe estes serviços
// receba instâncias que foram criadas APÓS a inicialização bem-sucedida.
export function getAdminServices() {
    return {
        db: admin.firestore(),
        auth: admin.auth(),
    };
}
