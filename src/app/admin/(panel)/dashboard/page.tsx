
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, CreditCard, AlertCircle } from 'lucide-react';
import { AtmStatusChart } from '@/components/admin/atm-status-chart';
import { db } from '@/firebase/init';
import type { Atm } from '@/types';
import { collection, getDocs } from 'firebase/firestore';


export interface DashboardData {
    atmCount: number;
    userCount: number;
    chartData: {
        name: string;
        value: number;
        fill: string;
    }[];
}

function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const atmsRef = collection(db, 'atms');
            const usersRef = collection(db, 'users');

            const [atmsSnapshot, usersSnapshot] = await Promise.all([
                getDocs(atmsRef),
                getDocs(usersRef)
            ]);
            
            const atms = atmsSnapshot.docs.map(doc => doc.data() as Atm);
            const userCount = usersSnapshot.size;
            const atmCount = atmsSnapshot.size;

            const statusCounts: { [key in Atm['status']]: number } = {
                com_dinheiro: 0,
                sem_dinheiro: 0,
                desconhecido: 0,
            };

            atms.forEach(atm => {
                    if (atm.status && statusCounts[atm.status] !== undefined) {
                    statusCounts[atm.status]++;
                }
            });

            const chartData = [
                { name: 'Com Dinheiro', value: statusCounts.com_dinheiro, fill: "var(--color-com_dinheiro)" },
                { name: 'Sem Dinheiro', value: statusCounts.sem_dinheiro, fill: "var(--color-sem_dinheiro)"  },
                { name: 'Desconhecido', value: statusCounts.desconhecido, fill: "var(--color-desconhecido)"  },
            ];

            setData({
                atmCount,
                userCount,
                chartData
            });

        } catch (err: any) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message || "Ocorreu um erro ao carregar os dados.");
        } finally {
            setLoading(false);
        }
      }

      fetchDashboardData();
    }, []);

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle />
                        Erro ao Carregar o Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Não foi possível carregar os dados do dashboard.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        <strong>Detalhes:</strong> {error}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de ATMs</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{data?.atmCount}</div>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Utilizadores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {loading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{data?.userCount}</div>}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Distribuição de Status dos ATMs</CardTitle>
                    <CardDescription>Visualização da quantidade de ATMs por status atual.</CardDescription>
                </CardHeader>
                <CardContent>
                     {loading ? (
                        <Skeleton className="h-64 w-full" />
                    ) : (
                        data?.chartData && <AtmStatusChart data={data.chartData} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminDashboardPage;
