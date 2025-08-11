
// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { Atm } from '@/types';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
    try {
        const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountString) {
            throw new Error('A variável de ambiente FIREBASE_SERVICE_ACCOUNT_KEY não está definida.');
        }

        const serviceAccount = JSON.parse(serviceAccountString);

        // A correção crucial: Formata a chave privada
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK inicializado com sucesso.");
    } catch (error: any) {
        console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
        // Em um ambiente de produção, você pode querer lidar com isso de forma mais graciosa.
        // Por agora, vamos lançar o erro para tornar o problema visível durante o desenvolvimento.
        throw new Error(`Falha na inicialização do Firebase Admin: ${error.message}`);
    }
}


const db = admin.firestore();

export async function addAtm(atmData: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'>): Promise<string> {
    const newAtmRef = db.collection('atms').doc();
    const newAtm = {
        ...atmData,
        status: 'desconhecido', // Initial status
        lastUpdate: new Date().toISOString(), // Use ISO string for consistency
        reports: [],
        details: atmData.details || '', // Garante que 'details' seja sempre uma string
    };
    await newAtmRef.set(newAtm);
    return newAtmRef.id;
}

export async function updateAtm(id: string, atmData: Partial<Omit<Atm, 'id'>>): Promise<void> {
    const atmRef = db.collection('atms').doc(id);
    await atmRef.update(atmData);
}


export async function getAtms(): Promise<Atm[]> {
  try {
    const atmsSnapshot = await db.collection('atms').get();
    if (atmsSnapshot.empty) {
      console.log("Nenhum ATM encontrado no Firestore.");
      return [];
    }

    const atms = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Correção: Garante que o timestamp seja convertido para string ISO
      const lastUpdate = data.lastUpdate?.toDate ? data.lastUpdate.toDate().toISOString() : data.lastUpdate || new Date().toISOString();
      
      const reports = data.reports?.map((report: any) => ({
          ...report,
          // Garante que o timestamp do relatório também seja convertido corretamente.
          timestamp: report.timestamp?.toDate ? report.timestamp.toDate().toISOString() : (report.timestamp || new Date().toISOString()),
      })) || [];

      return {
        id: doc.id,
        ...data,
        lastUpdate: lastUpdate,
        reports: reports,
      } as Atm;
    });
    return atms;
  } catch (error) {
    console.error("Erro ao buscar ATMs no Firestore:", error);
    return []; 
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
      
    // Correção: Garante que o timestamp seja convertido para string ISO
    const lastUpdate = data.lastUpdate?.toDate ? data.lastUpdate.toDate().toISOString() : data.lastUpdate || new Date().toISOString();
    
    const reports = data.reports?.map((report: any) => ({
      ...report,
      // Garante que o timestamp do relatório também seja convertido corretamente.
      timestamp: report.timestamp?.toDate ? report.timestamp.toDate().toISOString() : (report.timestamp || new Date().toISOString()),
    })) || [];

    return {
      id: atmDoc.id,
      ...data,
      details: data.details || '',
      lastUpdate: lastUpdate,
      reports: reports,
    } as Atm;
  
  } catch (error) {
    console.error(`Erro ao buscar ATM com id ${id}:`, error);
    return null;
  }
}
