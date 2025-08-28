
'use client'

import { useEffect, useState } from "react";
import { db } from '@/firebase/init';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";

interface Suggestion {
    id: string;
    name: string;
    address: string;
    details?: string;
    userName: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

const convertTimestampToString = (timestamp: any): string => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toISOString();
  }
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return new Date(0).toISOString();
};

const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
}

export default function AdminSuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, "atm_suggestions"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setSuggestions([]);
                } else {
                     const data: Suggestion[] = snapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name || '',
                        address: doc.data().address || '',
                        details: doc.data().details || '',
                        userName: doc.data().userName || 'Desconhecido',
                        status: doc.data().status || 'pending',
                        createdAt: convertTimestampToString(doc.data().createdAt),
                    }));
                    setSuggestions(data);
                }
            } catch (err: any) {
                console.error(err);
                setError('Failed to fetch suggestions');
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    const getStatusBadge = (status: Suggestion['status']) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pendente</Badge>;
            case 'approved':
                return <Badge variant="default">Aprovado</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejeitado</Badge>;
            default:
                return <Badge variant="outline">Desconhecido</Badge>;
        }
    };
    

    if (error) {
        return <div className="text-destructive text-center">Erro ao carregar as sugestões.</div>;
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Sugestões de Novos ATMs</CardTitle>
                <CardDescription>Reveja as sugestões enviadas pelos utilizadores.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ATM Sugerido</TableHead>
                                <TableHead>Endereço</TableHead>
                                <TableHead>Sugerido por</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                {/* <TableHead>Ações</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suggestions.length > 0 ? (
                                suggestions.map((suggestion) => (
                                <TableRow key={suggestion.id}>
                                    <TableCell className="font-medium">{suggestion.name}</TableCell>
                                    <TableCell>{suggestion.address}</TableCell>
                                    <TableCell>{suggestion.userName}</TableCell>
                                    <TableCell>{formatDate(suggestion.createdAt)}</TableCell>
                                    <TableCell>{getStatusBadge(suggestion.status)}</TableCell>
                                    {/* TODO: Add Approve/Reject buttons */}
                                    {/* <TableCell>Ações</TableCell> */}
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        Nenhuma sugestão encontrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                )}
            </CardContent>
        </Card>
    )
}
