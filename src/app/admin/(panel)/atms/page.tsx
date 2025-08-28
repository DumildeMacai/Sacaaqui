

'use client'

import { AtmDataTable } from "@/components/admin/atm-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Atm } from "@/types";
import { useEffect, useState } from "react";
import { db } from '@/firebase/init';
import { collection, getDocs, query } from 'firebase/firestore';


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


export default function AdminAtmsPage() {
    const [atms, setAtms] = useState<Atm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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


    if (error) {
        return <div className="text-destructive text-center">Erro ao carregar os ATMs. Tente novamente mais tarde.</div>;
    }

    if (loading) {
        return (
            <div className="space-y-4">
                 <div className="flex items-center justify-between py-4">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80 mt-2" />
                    </div>
                    <Skeleton className="h-10 w-36" />
                </div>
                <div className="rounded-md border bg-card">
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <AtmDataTable data={atms} />
        </div>
    )
}
