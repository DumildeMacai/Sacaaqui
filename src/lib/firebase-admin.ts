// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { Atm } from '@/types';
import serviceAccount from '@/firebase/serviceAccountKey.json';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
     console.log("Firebase Admin SDK inicializado com sucesso a partir do ficheiro JSON.");
  } catch (error: any) {
    console.error("Erro CRÍTICO ao inicializar o Firebase Admin SDK:", error.message);
  }
}

const db = admin.firestore();

export async function getAtms(): Promise<Atm[]> {
  try {
    const atmsSnapshot = await db.collection('atms').get();
    if (atmsSnapshot.empty) {
      console.log("Nenhum ATM encontrado no Firestore.");
      return [];
    }

    const atms = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        lastUpdate: data.lastUpdate?.toDate?.().toISOString() || new Date().toISOString(),
        reports: data.reports?.map((report: any) => ({
          ...report,
          timestamp: report.timestamp?.toDate?.().toISOString() || report.timestamp || new Date().toISOString(),
        })) || [],
      } as Atm;
    });
    return atms;
  } catch (error) {
    console.error("Erro ao buscar ATMs no Firestore:", error);
    // Em caso de erro, retorna um array vazio para não quebrar a aplicação
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
      
    return {
      id: atmDoc.id,
      ...data,
      lastUpdate: data.lastUpdate?.toDate?.().toISOString() || new Date().toISOString(),
      reports: data.reports?.map((report: any) => ({
        ...report,
        timestamp: report.timestamp?.toDate?.().toISOString() || report.timestamp || new Date().toISOString(),
      })) || [],
    } as Atm;
  
  } catch (error) {
    console.error(`Erro ao buscar ATM com id ${id}:`, error);
    return null;
  }
}
