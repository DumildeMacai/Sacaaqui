// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { Atm } from '@/types';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
    try {
        // A inicialização padrão lê as credenciais das variáveis de ambiente
        // (GOOGLE_APPLICATION_CREDENTIALS) ou de outras configurações do ambiente.
        admin.initializeApp();
        console.log("Firebase Admin SDK inicializado com sucesso.");
    } catch (error: any) {
        console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
        // Lançar um erro para interromper a execução se a inicialização falhar.
        throw new Error(`Falha na inicialização do Firebase Admin: ${error.message}`);
    }
}

const db = admin.firestore();

const convertTimestampToString = (timestamp: any): string => {
    if (!timestamp) {
        // Retorna um valor padrão ou lança um erro, dependendo da sua lógica.
        // Usar a data atual como fallback pode ser uma opção.
        return new Date().toISOString();
    }
    if (timestamp instanceof admin.firestore.Timestamp) {
        return timestamp.toDate().toISOString();
    }
    // Se já for uma string (ou outro tipo), apenas retorna.
    // Adicione validação extra se necessário.
    return timestamp.toString();
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