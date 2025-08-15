// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';
import type { Atm } from '@/types';
import dotenv from 'dotenv';
import expand from 'dotenv-expand';

// Carrega e expande as variáveis de ambiente do ficheiro .env
const env = dotenv.config();
expand.expand(env);

// Constrói o objeto de credenciais da conta de serviço a partir das variáveis de ambiente
// Esta abordagem é mais robusta do que fazer o parse de uma string JSON
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'), // Garante a formatação correta da chave privada
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Garante que o Firebase Admin SDK seja inicializado apenas uma vez
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK inicializado com sucesso.');
  } catch (error) {
    console.error('FALHA CRÍTICA: Erro ao inicializar o Firebase Admin SDK.', error);
    // Lança um erro para impedir que a aplicação continue a ser executada com uma configuração inválida do Firebase
    throw new Error('A inicialização do Firebase Admin falhou. Verifique as credenciais da conta de serviço.');
  }
}

const db = admin.firestore();

// Função auxiliar para converter Timestamps do Firestore para strings ISO de forma segura
const convertTimestampToString = (timestamp: any): string => {
  if (timestamp instanceof admin.firestore.Timestamp) {
    return timestamp.toDate().toISOString();
  }
  // Se já for uma string (de dados de mock ou já convertidos), retorna diretamente
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  // Retorna a data atual como um fallback seguro, embora isto deva ser raro com os dados do Firestore
  return new Date().toISOString(); 
};


export async function getAtms(): Promise<Atm[]> {
  try {
    const atmsSnapshot = await db.collection('atms').get();
    if (atmsSnapshot.empty) {
      return [];
    }

    const atms = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Garante que 'reports' seja sempre um array e que os seus timestamps sejam convertidos
      const reports = (data.reports || []).map((report: any) => ({
        ...report,
        timestamp: convertTimestampToString(report.timestamp),
      }));

      return {
        id: doc.id,
        name: data.name || '',
        address: data.address || '',
        location: data.location || { lat: 0, lng: 0 },
        status: data.status || 'desconhecido',
        details: data.details || '',
        lastUpdate: convertTimestampToString(data.lastUpdate),
        reports: reports,
      } as Atm;
    });
    return atms;
  } catch (error) {
    console.error("Erro ao buscar ATMs do Firestore:", error);
    // Lança um erro para que a API possa retornar uma resposta 500 informativa
    throw new Error('Falha ao buscar ATMs do Firestore.');
  }
}

export async function getAtmById(id: string): Promise<Atm | null> {
  try {
    const atmDoc = await db.collection('atms').doc(id).get();
    if (!atmDoc.exists) {
      return null;
    }

    const data = atmDoc.data()!;
    const reports = (data.reports || []).map((report: any) => ({
        ...report,
        timestamp: convertTimestampToString(report.timestamp),
    }));

    return {
      id: atmDoc.id,
      name: data.name || '',
      address: data.address || '',
      location: data.location || { lat: 0, lng: 0 },
      status: data.status || 'desconhecido',
      details: data.details || '',
      lastUpdate: convertTimestampToString(data.lastUpdate),
      reports: reports,
    } as Atm;
  } catch (error) {
    console.error(`Erro ao buscar ATM com ID ${id}:`, error);
    throw new Error(`Falha ao buscar ATM ${id} do Firestore.`);
  }
}


export async function addAtm(atmData: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'>): Promise<string> {
    const newAtmRef = db.collection('atms').doc();
    const newAtm = {
        ...atmData,
        status: 'desconhecido',
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
        reports: [], // Garante que 'reports' seja inicializado como um array vazio
        details: atmData.details || '', // Garante que 'details' seja uma string
    };
    await newAtmRef.set(newAtm);
    return newAtmRef.id;
}


export async function updateAtm(id: string, atmData: Partial<Omit<Atm, 'id'>>): Promise<void> {
    const atmRef = db.collection('atms').doc(id);
    // Garante que a atualização inclua o serverTimestamp
    const updateData = { ...atmData, lastUpdate: admin.firestore.FieldValue.serverTimestamp() };
    await atmRef.update(updateData);
}

// Remove a função de criação de utilizador admin, pois não é a abordagem correta para este problema
// A autenticação do painel de admin será tratada de outra forma
