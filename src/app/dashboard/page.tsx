import { AtmList } from '@/components/atm-list';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">ATMs Próximos</h1>
        <p className="text-muted-foreground">Veja o status dos caixas e ajude a comunidade.</p>
      </div>
      <Suspense fallback={<p>Carregando ATMs...</p>}>
        <AtmList />
      </Suspense>
    </div>
  );
}
