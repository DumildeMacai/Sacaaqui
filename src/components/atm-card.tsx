
import type { Atm } from '@/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle2, CircleSlash, HelpCircle, ThumbsDown, ThumbsUp, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type StatusVariant = 'default' | 'destructive' | 'secondary';

const statusMap: { [key in Atm['status']]: { text: string; variant: StatusVariant; icon: React.ReactNode; className: string } } = {
  com_dinheiro: { text: 'Com Dinheiro', variant: 'default', icon: <CheckCircle2 className="h-4 w-4" />, className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  sem_dinheiro: { text: 'Sem Dinheiro', variant: 'destructive', icon: <CircleSlash className="h-4 w-4" />, className: 'bg-red-500/20 text-red-400 border-red-500/30'},
  desconhecido: { text: 'Desconhecido', variant: 'secondary', icon: <HelpCircle className="h-4 w-4" />, className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'},
};


export function AtmCard({ 
    atm, 
    onStatusUpdate, 
    onClick,
    isSelected 
}: { 
    atm: Atm, 
    onStatusUpdate: (atmId: string, status: 'com_dinheiro' | 'sem_dinheiro') => void,
    onClick: () => void,
    isSelected: boolean
}) {
    const statusInfo = statusMap[atm.status];

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
        id={`atm-card-${atm.id}`}
        onClick={onClick}
        className={cn(
            "flex-shrink-0 w-80 p-4 rounded-2xl bg-background/70 backdrop-blur-md shadow-lg border-2 cursor-pointer transition-all duration-300",
            isSelected ? "border-primary shadow-primary/30" : "border-transparent"
        )}
    >
        <div className="flex justify-between items-start">
             <div className="flex-1 pr-2">
                <h3 className="font-bold text-lg truncate">{atm.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{atm.address}</p>
            </div>
            <Badge variant="outline" className={cn("flex items-center gap-1 whitespace-nowrap text-xs", statusInfo.className)}>
                {statusInfo.text}
            </Badge>
        </div>
       
        <div className="mt-4 flex justify-between items-center gap-2">
            <Button size="sm" variant="outline" className="w-full" onClick={(e) => { stopPropagation(e); onStatusUpdate(atm.id, 'com_dinheiro')}}>
                <ThumbsUp className="mr-2 h-4 w-4 text-green-400"/> Tem
            </Button>
            <Button size="sm" variant="outline" className="w-full" onClick={(e) => { stopPropagation(e); onStatusUpdate(atm.id, 'sem_dinheiro')}}>
                <ThumbsDown className="mr-2 h-4 w-4 text-red-400"/> Não Tem
            </Button>
            <Button size="sm" asChild variant="outline" className="w-full" onClick={stopPropagation}>
                <Link href={`/dashboard/atm/${atm.id}`}>
                    <Search className="mr-2 h-4 w-4"/> Detalhes
                </Link>
            </Button>
        </div>
    </div>
  );
}
