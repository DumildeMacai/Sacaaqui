import type { Atm } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, CircleSlash, HelpCircle, MapPin, ThumbsDown, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

type StatusVariant = 'default' | 'destructive' | 'secondary';

const statusMap: { [key in Atm['status']]: { text: string; variant: StatusVariant; icon: React.ReactNode } } = {
  com_dinheiro: { text: 'Com Dinheiro', variant: 'default', icon: <CheckCircle2 className="h-4 w-4 text-accent" /> },
  sem_dinheiro: { text: 'Sem Dinheiro', variant: 'destructive', icon: <CircleSlash className="h-4 w-4" /> },
  desconhecido: { text: 'Desconhecido', variant: 'secondary', icon: <HelpCircle className="h-4 w-4" /> },
};


export function AtmCard({ atm, onStatusUpdate }: { atm: Atm, onStatusUpdate: (atmId: string, status: 'com_dinheiro' | 'sem_dinheiro') => void }) {
    const statusInfo = statusMap[atm.status];
    const lastUpdate = formatDistanceToNow(new Date(atm.lastUpdate), { addSuffix: true, locale: ptBR });

  return (
    <Card className="flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-start justify-between">
                <span>{atm.name}</span>
                <Badge variant={statusInfo.variant} className="flex items-center gap-1 whitespace-nowrap">
                    {statusInfo.icon}
                    {statusInfo.text}
                </Badge>
            </CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
                <MapPin className="h-4 w-4" /> 
                {atm.address}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
           <p className="text-sm text-muted-foreground">
             Última atualização: {lastUpdate}
           </p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2 md:flex-row">
            <div className="flex flex-grow gap-2">
                 <Button variant="outline" className="w-full" onClick={() => onStatusUpdate(atm.id, 'com_dinheiro')}>
                    <ThumbsUp className="mr-2 h-4 w-4 text-accent"/> Tem
                </Button>
                <Button variant="outline" className="w-full" onClick={() => onStatusUpdate(atm.id, 'sem_dinheiro')}>
                    <ThumbsDown className="mr-2 h-4 w-4 text-destructive"/> Não Tem
                </Button>
            </div>
            <Button asChild className="w-full md:w-auto">
                <Link href={`/dashboard/atm/${atm.id}`}>Detalhes</Link>
            </Button>
        </CardFooter>
    </Card>
  );
}
