'use server'

import { getAdminDb } from '@/firebase/adminInit';
import type { Atm } from '@/types';

export async function getAtms(): Promise<Atm[]> {
  const adminDb = await getAdminDb();

  try {
    const atmsSnapshot = await adminDb.collection('atms').get();
    if (atmsSnapshot.empty) {
      console.log("Nenhum ATM encontrado no Firestore.");
      return [];
    }

    const atms = atmsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Garante que os Timestamps sejam convertidos para strings ISO
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
    const adminDb = await getAdminDb();
  
    try {
      const atmDoc = await adminDb.collection('atms').doc(id).get();
  
      if (!atmDoc.exists) {
        console.log(`ATM com id ${id} não encontrado.`);
        return null;
      }
  
      const data = atmDoc.data()!;
      
      return {
        id: atmDoc.id,
        ...data,
         // Garante que os Timestamps sejam convertidos para strings ISO
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
