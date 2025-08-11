import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { LogoutButton } from '@/components/logout-button';
import { Suspense } from 'react';
import { getAtms } from '@/lib/data'; // Importa a função para buscar dados reais

export default async function DashboardPage() { 
  // Usa a função para buscar dados do Firestore
  const atms = await getAtms();

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
