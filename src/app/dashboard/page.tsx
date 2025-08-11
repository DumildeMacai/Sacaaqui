import { getAdminDb } from '@/firebase/adminInit'; 
import { collection, getDocs } from 'firebase/firestore'; 
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { LogoutButton } from '@/components/logout-button';
import { Suspense } from 'react';

async function getAtms(): Promise<Atm[]> {
  try {
    const adminDb = getAdminDb(); 
    const querySnapshot = await getDocs(collection(adminDb, 'atms'));
    const atmsList: Atm[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Atm, 'id'>;
      if (data.lastUpdate && typeof data.lastUpdate !== 'string' && typeof (data.lastUpdate as any).toDate === 'function') {
        data.lastUpdate = (data.lastUpdate as any).toDate().toISOString();
      }
      return { ...data, id: doc.id } as Atm; 
    });
    console.log('ATMs carregados do Firestore no servidor.');
    return atmsList;
  } catch (error) {
    console.error('Erro ao carregar ATMs do Firestore no servidor:', error);
    return []; 
  }
}

export default async function DashboardPage() { 
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
