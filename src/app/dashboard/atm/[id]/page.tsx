import { AtmDetail } from '@/components/atm-detail';
import { getAdminDb } from '@/firebase/adminInit'; 
import { notFound } from 'next/navigation';
import type { Atm } from '@/types';
import { doc, getDoc } from 'firebase/firestore';

export default async function AtmDetailPage({ params }: { params: { id: string } }) {
  const { id: atmId } = params; 

  console.log("Tentando buscar ATM com ID (usando Admin SDK):", atmId); 
  const adminDb = getAdminDb(); 

  try {
    const atmRef = doc(adminDb, 'atms', atmId); 
    const docSnap = await getDoc(atmRef);

    if (!docSnap.exists()) {
      notFound(); 
    }

    const atmData = docSnap.data() as Atm; 

    if (atmData.lastUpdate && typeof atmData.lastUpdate !== 'string' && typeof (atmData.lastUpdate as any).toDate === 'function') {
        atmData.lastUpdate = (atmData.lastUpdate as any).toDate().toISOString();
    }
    
    return <AtmDetail atm={{ ...atmData, id: docSnap.id }} />;

  } catch (error) {
    console.error('Erro ao buscar ATM no Firestore (Admin SDK):', error);
    notFound();
  }
}
