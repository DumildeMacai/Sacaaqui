// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { Atm } from '@/types';

// Garante que a inicialização ocorra apenas uma vez.
if (!admin.apps.length) {
  try {
    // A formatação da chave privada é crucial. As quebras de linha precisam ser restauradas.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
        throw new Error('As credenciais do Firebase Admin não estão completas no ambiente.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    console.log("Firebase Admin SDK inicializado com sucesso.");
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
      details: data.details || null,
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
