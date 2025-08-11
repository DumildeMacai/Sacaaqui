import { AtmDetail } from '@/components/atm-detail';
// Importe a instância do Admin Firestore em vez do SDK do cliente
import { getAdminDb } from '@/firebase/adminInit'; // Importe a função para obter a instância do Admin Firestore
import { notFound } from 'next/navigation';
import type { Atm } from '@/types';
import { doc, getDoc } from 'firebase/firestore';

export default async function AtmDetailPage({ params }: { params: { id: string } }) {
  const { id: atmId } = params; // Obtenha o ID diretamente dos params

  console.log("Tentando buscar ATM com ID (usando Admin SDK):", atmId); // Adicione este log
  const adminDb = getAdminDb(); // Obtenha a instância do Admin Firestore

  try {
    // Use a instância do Admin Firestore diretamente importada
    const atmRef = doc(adminDb, 'atms', atmId); 
    const docSnap = await getDoc(atmRef);

    if (!docSnap.exists()) {
      notFound(); // Retorna 404 se o ATM não for encontrado no Firestore
    }

    const atmData = docSnap.data() as Atm; // Obtenha os dados do documento

    // --- Modificação: Converter Firestore Timestamp para Date ---
    if (atmData.lastUpdate && typeof atmData.lastUpdate !== 'string' && typeof (atmData.lastUpdate as any).toDate === 'function') {
        // Verifica se lastUpdate existe, não é uma string e tem o método toDate (indicando que é um Timestamp do Firestore) antes de converter
        atmData.lastUpdate = (atmData.lastUpdate as any).toDate().toISOString();
    }
    // --- Fim da Modificação ---


    // Passe os dados obtidos do Firestore para o componente AtmDetail
    return <AtmDetail atm={{ ...atmData, id: docSnap.id }} />;

  } catch (error) {
    console.error('Erro ao buscar ATM no Firestore (Admin SDK):', error);
    notFound(); // Retorna 404 em caso de erro na busca
  }
}
