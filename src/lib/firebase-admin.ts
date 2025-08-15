
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { Atm } from '@/types';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
    try {
        // Verifica se a variável de ambiente está definida
        const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountString) {
            throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não está definida.');
        }

        // Faz o parse da string JSON para um objeto
        const serviceAccount = JSON.parse(serviceAccountString);

        // A correção crucial: Formata a chave privada para substituir '\\n' por '\n'
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK inicializado com sucesso.");

    } catch (error: any) {
        console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
        // Em um ambiente de produção, você pode querer lidar com isso de forma mais graciosa.
        throw new Error(`Falha na inicialização do Firebase Admin: ${error.message}`);
    }
}


const db = admin.firestore();

export async function addAtm(atmData: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'>): Promise<string> {
    const newAtmRef = db.collection('atms').doc();
    const newAtm = {
        ...atmData,
        status: 'desconhecido', // Initial status
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
        reports: [], // Garante que reports seja sempre um array vazio ao criar
        details: atmData.details || '', // Garante que 'details' seja sempre uma string
    };
    await newAtmRef.set(newAtm);
    return newAtmRef.id;
}

export async function updateAtm(id: string, atmData: Partial<Omit<Atm, 'id'>>): Promise<void> {
    const atmRef = db.collection('atms').doc(id);
    const updateData = { ...atmData };

    // Assegura que lastUpdate seja atualizado com o timestamp do servidor
    updateData.lastUpdate = admin.firestore.FieldValue.serverTimestamp() as any;


    await atmRef.update(updateData);
}


// Função auxiliar robusta para converter Timestamps
const convertTimestampToString = (timestamp: any): string => {
    if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString();
    }
    if (typeof timestamp === 'string') {
        // Tenta validar se é um formato de data válido, se não, retorna uma data padrão
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toISOString();
        }
    }
    // Retorna a data atual como um fallback seguro
    return new Date().toISOString();
};


export async function getAtms(): Promise<Atm[]> {
  try {
    const atmsSnapshot = await db.collection('atms').get();
    if (atmsSnapshot.empty) {
      console.log("Nenhum ATM encontrado no Firestore.");
      return [];
    }

    const atms = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      
      const lastUpdate = convertTimestampToString(data.lastUpdate);
      
      // Garante que 'reports' seja sempre um array antes de mapear
      const reports = (data.reports || []).map((report: any) => ({
          ...report,
          timestamp: convertTimestampToString(report.timestamp),
      }));

      return {
        id: doc.id,
        ...data,
        lastUpdate: lastUpdate,
        reports: reports,
        details: data.details || '',
      } as Atm;
    });
    return atms;
  } catch (error) {
    console.error("Erro ao buscar ATMs no Firestore:", error);
    throw new Error('Falha ao buscar ATMs do Firestore.');
  }
}

export async function getAtmById(id: string): Promise<Atm | null> {
  try {
    const atmDoc = await db.collection('atms').doc(id).get();
  
    if (!atmDoc.exists) {
      console.log(`ATM com id ${id} não encontrado.`);
      return null;
    }
  
    const data = atmDoc.data()!;
      
    const lastUpdate = convertTimestampToString(data.lastUpdate);
    
    // Garante que 'reports' seja sempre um array antes de mapear
    const reports = (data.reports || []).map((report: any) => ({
        ...report,
        timestamp: convertTimestampToString(report.timestamp),
    }));

    return {
      id: atmDoc.id,
      ...data,
      details: data.details || '',
      lastUpdate: lastUpdate,
      reports: reports,
    } as Atm;
  
  } catch (error) {
    console.error(`Erro ao buscar ATM com id ${id}:`, error);
    throw new Error(`Falha ao buscar o ATM ${id} do Firestore.`);
  }
}
