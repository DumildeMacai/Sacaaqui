
'use client';
import type { Atm } from '@/types'; 
import { AtmList } from '@/components/atm-list';
import { useEffect, useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/firebase/init';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, LocateFixed, Loader2, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [lastCacheTime, setLastCacheTime] = useState<string | null>(null);


  const AtmMap = useMemo(() => dynamic(() => import('@/components/atm-map'), { 
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-2xl" />
  }), []);


  const handleLocateUser = () => {
    if (navigator.geolocation) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                // Maybe show a toast message to the user
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }
  };

  useEffect(() => {
    handleLocateUser(); // Try to locate user on initial load
  }, []);

  useEffect(() => {
    const q = query(collection(db, "atms"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const atmsData: Atm[] = querySnapshot.docs.map(doc => {
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
              viewCount: data.viewCount || 0,
            };
        });

        atmsData.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        setAtms(atmsData);

        localStorage.setItem('cachedAtms', JSON.stringify(atmsData));
        const now = new Date().toISOString();
        localStorage.setItem('cachedAtmsTimestamp', now);
        setLastCacheTime(now);

        setIsOffline(false);
        setError(null);
        setLoading(false);

    }, (err) => {
        console.error("Firestore snapshot error:", err);
        setError('Não foi possível carregar os dados. A mostrar a última versão guardada.');
        const cachedData = localStorage.getItem('cachedAtms');
        const cachedTimestamp = localStorage.getItem('cachedAtmsTimestamp');
        
        if (cachedData) {
            setAtms(JSON.parse(cachedData));
            setIsOffline(true);
            if (cachedTimestamp) {
                setLastCacheTime(cachedTimestamp);
            }
        } else {
            setError('Falha ao carregar os ATMs e não existem dados guardados para modo offline.');
        }
        setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount

  }, []); 

  const handleMarkerClick = (atmId: string) => {
    setSelectedAtmId(atmId);
    setAtms(prevAtms => {
        const selected = prevAtms.find(a => a.id === atmId);
        if (!selected) return prevAtms;
        // Move selected to front, maintaining original sort for the rest
        const others = prevAtms.filter(a => a.id !== atmId);
        const newSorted = [selected, ...others];
        
        // After highlighting, re-apply the original popularity sort to the rest
        const sortedOthers = others.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        
        // Find the index of the originally selected ATM to put it back if needed
        const originalIndex = prevAtms.findIndex(a => a.id === atmId);

        // Put it on top
        return [selected, ...prevAtms.filter(a => a.id !== atmId)];
    });
  };

  const filteredAtms = useMemo(() => {
    if (!searchTerm) {
      return atms;
    }
    return atms.filter(atm =>
      atm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atm.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [atms, searchTerm]);


  if (error && !isOffline) {
    return <div className="text-destructive text-center p-8">{error}</div>;
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
      
       {isOffline && lastCacheTime && (
            <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Você está offline</AlertTitle>
                <AlertDescription>
                    A mostrar dados guardados de {formatDistanceToNow(new Date(lastCacheTime), { addSuffix: true, locale: ptBR })}.
                </Aler
tDescription>
            </Alert>
        )}

      <div className="bg-white p-4 rounded-2xl shadow-md h-[400px] md:h-[500px] relative">
          <AtmMap 
              atms={filteredAtms} 
              onMarkerClick={handleMarkerClick}
              selectedAtmId={selectedAtmId}
              userLocation={userLocation}
          />
           <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLocateUser} 
                className="absolute top-6 right-6 bg-white shadow-lg"
                title="A minha localização"
                disabled={isLocating}
            >
                {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
            </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
              <>
                  <Skeleton className="h-[160px] w-full rounded-2xl" />
                  <Skeleton className="h-[160px] w-full rounded-2xl" />
                  <Skeleton className="h-[160px] w-full rounded-2xl" />
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
  );
}
