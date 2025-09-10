
import type { Atm } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CircleSlash, HelpCircle, MapPin, Clock, Info, ArrowLeft, WifiOff } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AtmVerificationClient } from './atm-verification-client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type StatusVariant = 'default' | 'destructive' | 'secondary';

const statusMap: { [key in Atm['status']]: { text: string; variant: StatusVariant; icon: React.ReactNode } } = {
  com_dinheiro: { text: 'Com Dinheiro', variant: 'default', icon: <CheckCircle2 className="h-4 w-4 text-accent" /> },
  sem_dinheiro: { text: 'Sem Dinheiro', variant: 'destructive', icon: <CircleSlash className="h-4 w-4" /> },
  desconhecido: { text: 'Desconhecido', variant: 'secondary', icon: <HelpCircle className="h-4 w-4" /> },
};

export function AtmDetail({ atm, offlineMessage }: { atm: Atm, offlineMessage?: string | null }) {
  const router = useRouter();
  const statusInfo = statusMap[atm.status];

  // Ordena os relatórios, do mais recente para o mais antigo
  const sortedReports = [...atm.reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Lista
        </Button>

        {offlineMessage && (
            <Alert variant="destructive">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Você está offline</AlertTitle>
                <AlertDescription>{offlineMessage}</AlertDescription>
            </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="flex-1 font-headline text-3xl">
                                {atm.name}
                            </CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-2 pt-2">
                            <MapPin className="h-4 w-4" />
                            {atm.address}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex items-center justify-between text-sm text-muted-foreground">
                             <Badge variant={statusInfo.variant} className="flex items-center gap-1 text-base">
                                {statusInfo.icon}
                                {statusInfo.text}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Última atualização: {format(new Date(atm.lastUpdate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {atm.details && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                            <Info className="h-5 w-5" />
                            Detalhes Adicionais
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{atm.details}</p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Atualizações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {sortedReports.length > 0 ? (
                                sortedReports.map((report, index) => (
                                <li key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {report.status === 'com_dinheiro' ? <CheckCircle2 className="h-5 w-5 text-accent" /> : <CircleSlash className="h-5 w-5 text-destructive" />}
                                        <div>
                                            <p className="font-medium">Status: {report.status === 'com_dinheiro' ? 'Com Dinheiro' : 'Sem Dinheiro'}</p>
                                            <p className="text-sm text-muted-foreground">por {report.userName}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(report.timestamp), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                </li>
                                ))
                            ) : (
                                <li className='text-muted-foreground text-sm'>Ainda não há relatórios para este ATM.</li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="md:col-span-1">
                <AtmVerificationClient atm={atm} />
            </div>
        </div>
    </div>
  );
}
