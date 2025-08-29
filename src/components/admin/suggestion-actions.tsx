
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Suggestion } from "@/types";
import { handleApproveSuggestion, handleRejectSuggestion } from "@/actions/manage-suggestion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface SuggestionActionsProps {
    suggestion: Suggestion;
    onSuggestionUpdate: () => void;
}

export function SuggestionActions({ suggestion, onSuggestionUpdate }: SuggestionActionsProps) {
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // State for the approval form
    const [name, setName] = useState(suggestion.name);
    const [address, setAddress] = useState(suggestion.address);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [details, setDetails] = useState(suggestion.details || '');

    const handleApprove = async () => {
        setIsLoading(true);
        
        const result = await handleApproveSuggestion({
            suggestionId: suggestion.id,
            userId: suggestion.userId,
            name,
            address,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            details,
        });

        setIsLoading(false);
        if (result.success) {
            toast({ title: 'Sucesso!', description: 'Sugestão aprovada e novo ATM criado.' });
            setIsApproveModalOpen(false);
            onSuggestionUpdate();
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: result.error });
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        const result = await handleRejectSuggestion({
            suggestionId: suggestion.id,
            suggestionName: suggestion.name,
            userId: suggestion.userId
        });
        
        setIsLoading(false);
        if (result.success) {
            toast({ title: 'Sugestão Rejeitada', description: 'O status da sugestão foi atualizado.' });
            onSuggestionUpdate();
        } else {
            toast({ variant: 'destructive', title: 'Erro', description: result.error });
        }
    };

    if (suggestion.status !== 'pending') {
        return (
            <Badge variant={suggestion.status === 'approved' ? 'default' : 'destructive'} className="cursor-default">
                {suggestion.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
            </Badge>
        );
    }

    return (
        <div className="flex justify-end gap-2">
            <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Aprovar">
                        <Check className="h-4 w-4 text-accent" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Aprovar e Criar ATM</DialogTitle>
                        <DialogDescription>
                            Reveja e edite os detalhes da sugestão antes de a adicionar ao mapa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Endereço</Label>
                            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lat" className="text-right">Latitude</Label>
                            <Input id="lat" type="number" placeholder="Ex: -8.8157" value={lat} onChange={(e) => setLat(e.target.value)} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lng" className="text-right">Longitude</Label>
                            <Input id="lng" type="number" placeholder="Ex: 13.2306" value={lng} onChange={(e) => setLng(e.target.value)} className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="details" className="text-right">Detalhes</Label>
                            <Input id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleApprove} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Aprovar e Criar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                     <Button variant="ghost" size="icon" title="Rejeitar">
                        <X className="h-4 w-4 text-destructive" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação irá marcar a sugestão como "rejeitada" e notificar o utilizador. Não poderá ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReject} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
                           {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar Rejeição'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
