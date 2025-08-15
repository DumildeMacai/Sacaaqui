
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Atm } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/init';

const EditAtmPage = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const atmId = params.id as string;

    useEffect(() => {
        if (!atmId) return;

        const fetchAtmData = async () => {
            setIsFetching(true);
            try {
                const atmRef = doc(db, 'atms', atmId);
                const atmDoc = await getDoc(atmRef);

                if (!atmDoc.exists()) {
                     throw new Error('ATM não encontrado.');
                }
                
                const atm = atmDoc.data() as Omit<Atm, 'id'>;
                setName(atm.name);
                setAddress(atm.address);
                setLat(atm.location.lat.toString());
                setLng(atm.location.lng.toString());
                setDetails(atm.details || '');

            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: 'Não foi possível carregar os dados do ATM.',
                });
            } finally {
                setIsFetching(false);
            }
        };

        fetchAtmData();
    }, [atmId, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const updatedAtm = {
            name,
            address,
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            },
            details,
            lastUpdate: serverTimestamp(),
        };

        try {
            const atmRef = doc(db, 'atms', atmId);
            await updateDoc(atmRef, updatedAtm);

            toast({
                title: 'Sucesso!',
                description: 'Dados do ATM atualizados com sucesso.',
            });

            router.push('/admin/panel');
            router.refresh();

        } catch (error) {
            console.error('Error updating ATM with Firestore Client:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível atualizar o ATM. Tente novamente.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-2/4" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="grid gap-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="grid gap-2">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                     <div className="grid gap-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="flex justify-end">
                        <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Editar ATM</CardTitle>
                <CardDescription>Atualize os detalhes do caixa eletrônico.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome do ATM</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input id="lat" type="number" value={lat} onChange={(e) => setLat(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lng">Longitude</Label>
                            <Input id="lng" type="number" value={lng} onChange={(e) => setLng(e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="details">Detalhes Adicionais</Label>
                        <Input id="details" value={details} onChange={(e) => setDetails(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default EditAtmPage;
