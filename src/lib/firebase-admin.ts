
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

        // Formatação correta da chave privada
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase Admin SDK inicializado com sucesso.");

    } catch (error: any) {
        console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
        // Lançar um erro para interromper a execução se a inicialização falhar.
        throw new Error(`Falha na inicialização do Firebase Admin: ${error.message}`);
    }
}


const db = admin.firestore();

export async function addAtm(atmData: Omit<Atm, 'id' | 'status' | 'lastUpdate' | 'reports'>): Promise<string> {
    const newAtmRef = db.collection('atms').doc();
    const newAtm = {
        ...atmData,
        status: 'desconhecido', 
        lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
        reports: [], 
        details: atmData.details || '',
    };
    await newAtmRef.set(newAtm);
    return newAtmRef.id;
}

export async function updateAtm(id: string, atmData: Partial<Omit<Atm, 'id'>>): Promise<void> {
    const atmRef = db.collection('atms').doc(id);
    const updateData = { ...atmData, lastUpdate: admin.firestore.FieldValue.serverTimestamp() };
    await atmRef.update(updateData);
}

const convertTimestampToString = (timestamp: any): string => {
    if (!timestamp) return new Date().toISOString();
    if (timestamp instanceof admin.firestore.Timestamp) {
        return timestamp.toDate().toISOString();
    }
    if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toISOString();
        }
    }
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
    console.error("Erro ao buscar ATMs no Firestore:", error);
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
    console.error(`Erro ao buscar ATM com id ${id}:`, error);
    throw new Error(`Falha ao buscar o ATM ${id} do Firestore.`);
  }
}
