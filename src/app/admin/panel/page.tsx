
'use client'

import { useEffect, useState } from "react";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase/init';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Atm } from "@/types";
import { AtmStatusChart, type ChartData } from "@/components/admin/atm-status-chart";

export default function AdminPanelPage() {
    const [atmCount, setAtmCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const atmsQuery = query(collection(db, "atms"));
                const usersQuery = query(collection(db, "users"));

                const [atmsSnapshot, usersSnapshot] = await Promise.all([
                    getDocs(atmsQuery),
                    getDocs(usersQuery)
                ]);

                // ATM Data
                setAtmCount(atmsSnapshot.size);
                
                const statusCounts: { [key in Atm['status']]: number } = {
                    com_dinheiro: 0,
                    sem_dinheiro: 0,
                    desconhecido: 0,
                };

                atmsSnapshot.forEach(doc => {
                    const atm = doc.data() as Atm;
                    if (statusCounts[atm.status] !== undefined) {
                        statusCounts[atm.status]++;
                    }
                });

                const formattedChartData = [
                    { name: 'Com Dinheiro', value: statusCounts.com_dinheiro, fill: "var(--color-com_dinheiro)" },
                    { name: 'Sem Dinheiro', value: statusCounts.sem_dinheiro, fill: "var(--color-sem_dinheiro)"  },
                    { name: 'Desconhecido', value: statusCounts.desconhecido, fill: "var(--color-desconhecido)"  },
                ];
                setChartData(formattedChartData);


                // User Data
                setUserCount(usersSnapshot.size);

            } catch (err: any) {
                console.error(err);
                setError('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div className="text-destructive text-center">Erro ao carregar os dados do dashboard. Tente novamente mais tarde.</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de ATMs</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{atmCount}</div>}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{userCount}</div>}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                        Status dos ATMs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Skeleton className="h-64 w-full" />
                    ) : (
                       <AtmStatusChart data={chartData} />
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
