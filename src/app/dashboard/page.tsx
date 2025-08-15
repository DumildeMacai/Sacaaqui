'use client';
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { LogoutButton } from '@/components/logout-button';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/firebase/init';
import { collection, getDocs, query } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Helper to convert Firestore Timestamps to ISO strings safely
const convertTimestampToString = (timestamp: any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date(0).toISOString();
};


export default function DashboardPage() { 
  const [atms, setAtms] = useState<Atm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAtms = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "atms"));
        const atmsSnapshot = await getDocs(q);
        
        if (atmsSnapshot.empty) {
          setAtms([]);
        } else {
           const atmsData: Atm[] = atmsSnapshot.docs.map(doc => {
              const data = doc.data();
              const reports = (data.reports || []).map((report: any) => ({
                ...report,
                timestamp: convertTimestampToString(report.timestamp),
              }));

              return {
                id: doc.id,
                name: data.name || '',
                address: data.address || '',
                location: data.location || { lat: 0, lng: 0 },
                status: data.status || 'desconhecido',
                details: data.details || '',
                lastUpdate: convertTimestampToString(data.lastUpdate),
                reports: reports,
              };
            });
            setAtms(atmsData);
        }

      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch ATMs');
      } finally {
        setLoading(false);
      }
    };

    fetchAtms();
  }, []);

  const filteredAtms = useMemo(() => {
    if (!searchTerm) {
      return atms;
    }
    return atms.filter(atm =>
      atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [atms, searchTerm]);


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

       <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Pesquisar por nome ou endereço..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <AtmList atms={filteredAtms} />
        )}
      </Suspense>
    </div>
  );
}
