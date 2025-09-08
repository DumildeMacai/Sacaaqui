
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, CreditCard, AlertCircle } from 'lucide-react';
import { AtmStatusChart } from '@/components/admin/atm-status-chart';
import { auth } from '@/firebase/init';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import type { Atm } from '@/types';
import { getDashboardData } from '@/actions/get-admin-data';

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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await getIdToken(user);
                    const result = await getDashboardData(token);

                    if (result.success && result.data) {
                        const statusCounts: { [key in Atm['status']]: number } = {
                            com_dinheiro: 0,
                            sem_dinheiro: 0,
                            desconhecido: 0,
                        };
                        result.data.atms.forEach(atm => {
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
                            atmCount: result.data.atmCount,
                            userCount: result.data.userCount,
                            chartData
                        });
                    } else {
                         throw new Error(result.error || "Acesso não autorizado ou falha ao buscar os dados.");
                    }
                } catch (err: any) {
                    console.error("Error fetching dashboard data:", err);
                    setError(err.message || "Ocorreu um erro desconhecido.");
                } finally {
                    setLoading(false);
                }
            } else {
                // Se não houver utilizador, definir o erro e parar o carregamento
                setError("Utilizador não autenticado.");
                setLoading(false);
            }
        });

        return () => unsubscribe();
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
