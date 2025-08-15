'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/init';

const AddAtmPage = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [details, setDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newAtmPayload = {
            name,
            address,
            location: {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            },
            details,
            status: 'desconhecido',
            lastUpdate: serverTimestamp(),
            reports: [],
        };

        try {
            await addDoc(collection(db, 'atms'), newAtmPayload);

            toast({
                title: 'Sucesso!',
                description: 'Novo ATM adicionado com sucesso.',
            });

            router.push('/admin/panel');
            router.refresh();

        } catch (error) {
            console.error('Error adding ATM with Firestore Client:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível adicionar o ATM. Tente novamente.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Novo ATM</CardTitle>
                <CardDescription>Preencha os detalhes do novo caixa eletrônico.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome do ATM</Label>
                        <Input id="name" placeholder="Ex: Caixa do BCI - Mutamba" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" placeholder="Ex: Largo da Mutamba, Luanda, Angola" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input id="lat" type="number" placeholder="-8.8157" value={lat} onChange={(e) => setLat(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lng">Longitude</Label>
                            <Input id="lng" type="number" placeholder="13.2306" value={lng} onChange={(e) => setLng(e.target.value)} required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="details">Detalhes Adicionais</Label>
                        <Input id="details" placeholder="Ex: Localizado perto da entrada principal." value={details} onChange={(e) => setDetails(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Salvar ATM
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default AddAtmPage;
