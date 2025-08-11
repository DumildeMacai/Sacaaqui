'use client'
import { AtmDetail } from '@/components/atm-detail';
import { notFound } from 'next/navigation';
import type { Atm } from '@/types';
import { mockAtms } from '@/lib/mock-data'; // Importa os dados mockados

export default function AtmDetailPage({ params }: { params: { id: string } }) {
  const { id: atmId } = params;

  // Procura o ATM nos dados mockados
  const atmData = mockAtms.find(atm => atm.id === atmId);

  // Se não encontrar o ATM, exibe a página de não encontrado
  if (!atmData) {
    notFound();
  }

  // Renderiza o componente com os dados do ATM encontrado
  return <AtmDetail atm={atmData} />;
}
