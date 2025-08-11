'use client'
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { LogoutButton } from '@/components/logout-button';
import { Suspense } from 'react';
import { mockAtms } from '@/lib/mock-data'; // Importa os dados mockados

export default function DashboardPage() { 
  // Usa os dados mockados em vez de buscar do Firestore
  const atms = mockAtms;

 return (
    <div className="min-h-screen p-8"> 
      <div className="flex justify-between items-center mb-8"> 
        <div className="mb-8"> 
          <h1 className="text-3xl font-bold tracking-tight font-headline">ATMs Próximos</h1>
          <p className="text-muted-foreground">Veja o status dos caixas e ajude a comunidade.</p> 
        </div>
        <LogoutButton /> 
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <AtmList initialAtms={atms} />
      </Suspense>
    </div>
  );
}
