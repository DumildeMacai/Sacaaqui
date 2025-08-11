'use client'
import { AtmDetail } from '@/components/atm-detail';
import { notFound, useParams } from 'next/navigation';
import type { Atm } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AtmDetailPage() {
  const params = useParams();
  const atmId = params.id as string;
  const [atmData, setAtmData] = useState<Atm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!atmId) return;

    const fetchAtm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/atms/${atmId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch ATM data');
        }
        const data: Atm = await response.json();
        setAtmData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAtm();
  }, [atmId]);

  if (loading) {
    return (
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-1">
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }
  
  if (error) {
      return <div className="text-destructive text-center">Erro ao carregar os dados do ATM. Tente novamente mais tarde.</div>;
  }

  if (!atmData) {
    notFound();
  }

  return <AtmDetail atm={atmData} />;
}
