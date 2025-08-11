import { AtmDetail } from '@/components/atm-detail';
import { notFound } from 'next/navigation';
import type { Atm } from '@/types';
import { getAtmById } from '@/lib/data'; // Importa a função para buscar dados reais por ID

export default async function AtmDetailPage({ params }: { params: { id: string } }) {
  const { id: atmId } = params;

  // Procura o ATM no Firestore
  const atmData = await getAtmById(atmId);

  // Se não encontrar o ATM, exibe a página de não encontrado
  if (!atmData) {
    notFound();
  }

  // Renderiza o componente com os dados do ATM encontrado
  return <AtmDetail atm={atmData} />;
}
