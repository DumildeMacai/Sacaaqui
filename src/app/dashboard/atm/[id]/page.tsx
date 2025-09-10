
'use client'
import { AtmDetail } from '@/components/atm-detail';
import { notFound, useParams } from 'next/navigation';
import type { Atm } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/init';


// Helper to convert Firestore Timestamps to ISO strings safely
const convertTimestampToString = (timestamp: any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  // Fallback for null, undefined, or other types
  return new Date(0).toISOString();
};


export default function AtmDetailPage() {
  const params = useParams();
  const atmId = params.id as string;
  const [atmData, setAtmData] = useState<Atm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!atmId) return;

    // Increment view count once on component mount - fire-and-forget
    const atmRef = doc(db, 'atms', atmId);
    updateDoc(atmRef, { viewCount: increment(1) }).catch(console.error);
    
    const unsubscribe = onSnapshot(atmRef, (atmDoc) => {
        if (atmDoc.exists()) {
            const data = atmDoc.data();
            const reports = (data.reports || []).map((report: any) => ({
                ...report,
                timestamp: convertTimestampToString(report.timestamp),
            }));

            const atm: Atm = {
                id: atmDoc.id,
                name: data.name || '',
                address: data.address || '',
                location: data.location || { lat: 0, lng: 0 },
                status: data.status || 'desconhecido',
                details: data.details || '',
                lastUpdate: convertTimestampToString(data.lastUpdate),
                reports: reports,
                viewCount: data.viewCount || 0,
                followers: data.followers || [],
            };
            setAtmData(atm);
        } else {
            setError('ATM não encontrado');
            notFound();
        }
        setLoading(false);
    }, (err) => {
        console.error(err);
        setError('Failed to fetch ATM data');
        setLoading(false);
    });

    return () => unsubscribe();
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
