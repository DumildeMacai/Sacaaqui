
'use client';
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/firebase/init';
import { collection, getDocs, query } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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
  const [selectedAtmId, setSelectedAtmId] = useState<string | null>(null);

  const AtmMap = useMemo(() => dynamic(() => import('@/components/atm-map'), { 
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-2xl" />
  }), []);

  useEffect(() => {
    const fetchAtms = async () => {
      try {
        const q = query(collection(db, "atms"));
        const atmsSnapshot = await getDocs(q);
        
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
          setError(null);

      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch ATMs');
      } finally {
        if (loading) {
          setLoading(false);
        }
      }
    };

    const initialFetch = async () => {
        await fetchAtms();
        setLoading(false);
    };

    initialFetch();
    
    const intervalId = setInterval(fetchAtms, 1000); 

    return () => clearInterval(intervalId);
  }, [loading]); 

  const filteredAtms = useMemo(() => {
    if (!searchTerm) {
      return atms;
    }
    return atms.filter(atm =>
      atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [atms, searchTerm]);


  if (error && loading) {
    return <div className="text-destructive text-center p-8">Erro ao carregar os ATMs. Tente novamente mais tarde.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">ATMs Próximos</h1>
                <p className="text-gray-500 mt-1">Veja o status dos caixas e ajude a comunidade.</p>
            </div>
            <div className="w-full md:w-auto flex items-center gap-4">
                 <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Pesquisar por nome ou endereço..."
                        className="w-full pl-10 bg-white border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        suppressHydrationWarning={true}
                    />
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                    <Link href="/dashboard/suggest-atm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Sugerir um ATM
                    </Link>
                </Button>
            </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl shadow-md h-[400px] md:h-[500px]">
          <AtmMap 
              atms={filteredAtms} 
              onMarkerClick={(atmId) => setSelectedAtmId(atmId)}
              selectedAtmId={selectedAtmId}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
              <>
                  <Skeleton className="h-[160px] w-full rounded-2xl" />
                  <Skeleton className="h-[160px] w-full rounded-2xl" />
                  <Skeleton className="h-[160px] w-full rounded-2xl" />
              </>
          ) : (
              !loading && <AtmList 
                  atms={filteredAtms} 
                  onCardClick={(atmId) => setSelectedAtmId(atmId)}
                  selectedAtmId={selectedAtmId}
              />
          )}
      </div>
    </div>
  );
}
