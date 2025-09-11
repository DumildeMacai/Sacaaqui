
import type { Atm } from '@/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ThumbsDown, ThumbsUp, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusMap: { [key in Atm['status']]: { text: string; className: string } } = {
  com_dinheiro: { text: 'Com Dinheiro', className: 'bg-green-100 text-green-800 border-green-200' },
  sem_dinheiro: { text: 'Sem Dinheiro', className: 'bg-red-100 text-red-800 border-red-200'},
  desconhecido: { text: 'Desconhecido', className: 'bg-gray-100 text-gray-800 border-gray-200'},
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

    const lastUpdateDistance = formatDistanceToNow(new Date(atm.lastUpdate), {
        addSuffix: true,
        locale: ptBR,
    });

  return (
    <div
        id={`atm-card-${atm.id}`}
        onClick={onClick}
        className={cn(
            "p-4 rounded-2xl bg-white border cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg",
            isSelected ? "border-primary ring-2 ring-primary ring-offset-2" : "border-gray-200"
        )}
    >
        <div className="flex justify-between items-start gap-2">
             <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-gray-800 truncate">{atm.name}</h3>
                <p className="text-sm text-gray-500 truncate">{atm.address}</p>
            </div>
            <Badge variant="outline" className={cn("flex items-center gap-1 whitespace-nowrap text-xs flex-shrink-0", statusInfo.className)}>
                {statusInfo.text}
            </Badge>
        </div>
       
        <div className="flex items-center text-xs text-gray-400 mt-3">
            <Clock className="h-3 w-3 mr-1.5" />
            Última atualização: {lastUpdateDistance}
        </div>

        <div className="mt-4 flex justify-between items-center gap-2">
            <Button size="sm" variant="outline" className="w-full border-green-300 text-green-800 hover:bg-green-50" onClick={(e) => { stopPropagation(e); onStatusUpdate(atm.id, 'com_dinheiro')}}>
                <ThumbsUp className="mr-2 h-4 w-4"/> Tem
            </Button>
            <Button size="sm" variant="outline" className="w-full border-red-300 text-red-800 hover:bg-red-50" onClick={(e) => { stopPropagation(e); onStatusUpdate(atm.id, 'sem_dinheiro')}}>
                <ThumbsDown className="mr-2 h-4 w-4"/> Não Tem
            </Button>
            <Button size="sm" asChild variant="outline" className="w-full border-blue-300 text-blue-800 hover:bg-blue-50" onClick={stopPropagation}>
                <Link href={`/dashboard/atm/${atm.id}`}>
                    <Search className="mr-2 h-4 w-4"/> Detalhes
                </Link>
            </Button>
        </div>
    </div>
  );
}
