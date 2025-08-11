
'use client'

import { AtmDataTable } from "@/components/admin/atm-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Atm } from "@/types";
import { useEffect, useState } from "react";

export default function AdminPanelPage() {
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
