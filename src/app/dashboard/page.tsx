
'use client';
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { useEffect, useState, useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/firebase/init';
import { collection, getDocs, query } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

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
  const [selectedAtmId, setSelectedAtmId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  const AtmMap = useMemo(() => dynamic(() => import('@/components/atm-map'), { 
    ssr: false,
    loading: () => <Skeleton className="absolute inset-0" />
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

    fetchAtms();
    
    const intervalId = setInterval(fetchAtms, 3000); 

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

  // When an ATM is selected (from map), scroll it into view in the list
    useEffect(() => {
        if (selectedAtmId && listRef.current) {
            const element = document.getElementById(`atm-card-${selectedAtmId}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                });
            }
        }
    }, [selectedAtmId]);


  if (error && loading) {
    return <div className="text-destructive text-center p-8">Erro ao carregar os ATMs. Tente novamente mais tarde.</div>;
  }

  return (
    <div className="h-full w-full">
        <AtmMap 
            atms={filteredAtms} 
            onMarkerClick={(atmId) => setSelectedAtmId(atmId)}
            selectedAtmId={selectedAtmId}
        />
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Pesquisar por nome ou endereço..."
                    className="w-full pl-10 rounded-full shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div 
            ref={listRef} 
            className="absolute bottom-0 left-0 right-0 z-10 p-4 overflow-x-auto"
        >
            <div className="flex gap-4">
                {loading ? (
                    <>
                        <Skeleton className="h-[150px] w-80 rounded-xl flex-shrink-0" />
                        <Skeleton className="h-[150px] w-80 rounded-xl flex-shrink-0" />
                        <Skeleton className="h-[150px] w-80 rounded-xl flex-shrink-0" />
                    </>
                ) : (
                    <AtmList 
                        atms={filteredAtms} 
                        onCardClick={(atmId) => setSelectedAtmId(atmId)}
                        selectedAtmId={selectedAtmId}
                    />
                )}
            </div>
        </div>
    </div>
  );
}
