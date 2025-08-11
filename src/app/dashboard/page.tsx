'use client';
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { LogoutButton } from '@/components/logout-button';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() { 
  const [atms, setAtms] = useState<Atm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAtms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/atms');
        if (!response.ok) {
          throw new Error('Failed to fetch ATMs');
        }
        const data: Atm[] = await response.json();
        setAtms(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAtms();
  }, []);

  if (error) {
    return <div className="text-destructive text-center">Erro ao carregar os ATMs. Tente novamente mais tarde.</div>;
  }

  return (
    <div className="min-h-screen p-8"> 
      <div className="flex justify-between items-center mb-8"> 
        <div className="mb-8"> 
          <h1 className="text-3xl font-bold tracking-tight font-headline">ATMs Próximos</h1>
          <p className="text-muted-foreground">Veja o status dos caixas e ajude a comunidade.</p> 
        </div>
        <LogoutButton /> 
      </div>
      <Suspense fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[220px] w-full rounded-xl" />
          </div>
      }>
        {loading ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
                <Skeleton className="h-[220px] w-full rounded-xl" />
             </div>
        ) : (
            <AtmList initialAtms={atms} />
        )}
      </Suspense>
    </div>
  );
}
