
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Suggestion } from "@/types";
import { handleApproveSuggestion, handleRejectSuggestion } from "@/actions/manage-suggestion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { geocodeAddressAction } from "@/actions/geocode-address";


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
    const [details, setDetails] = useState(suggestion.details || '');
    const [geocodingError, setGeocodingError] = useState<string | null>(null);

    useEffect(() => {
        if (isApproveModalOpen) {
            // Reset state when modal opens
            setName(suggestion.name);
            setAddress(suggestion.address);
            setDetails(suggestion.details || '');
            setGeocodingError(null);
        }
    }, [isApproveModalOpen, suggestion]);


    const handleGeocodeAndApprove = async () => {
        setIsLoading(true);
        setGeocodingError(null);

        try {
            // Step 1: Geocode the address
            const geocodeResult = await geocodeAddressAction(address);

            if (!geocodeResult.success || geocodeResult.lat === undefined || geocodeResult.lng === undefined) {
                const errorMsg = geocodeResult.error || "Não foi possível encontrar as coordenadas para este endereço. Verifique o endereço.";
                setGeocodingError(errorMsg);
                toast({ variant: 'destructive', title: 'Erro de Geocodificação', description: errorMsg });
                setIsLoading(false);
                return;
            }

            // Step 2: Approve the suggestion with the new coordinates
            const result = await handleApproveSuggestion({
                suggestionId: suggestion.id,
                userId: suggestion.userId,
                name,
                address,
                lat: geocodeResult.lat,
                lng: geocodeResult.lng,
                details,
            });

            if (result.success) {
                toast({ title: 'Sucesso!', description: 'Sugestão aprovada e novo ATM criado.' });
                setIsApproveModalOpen(false);
                onSuggestionUpdate();
            } else {
                toast({ variant: 'destructive', title: 'Erro ao Aprovar', description: result.error });
            }

        } catch (error) {
            console.error("Error during geocoding/approval process:", error);
            toast({ variant: 'destructive', title: 'Erro Inesperado', description: 'Ocorreu um erro. Tente novamente.' });
        } finally {
            setIsLoading(false);
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
                            Reveja os detalhes. As coordenadas serão obtidas automaticamente a partir do endereço.
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
                            <Label htmlFor="details" className="text-right">Detalhes</Label>
                            <Input id="details" value={details} onChange={(e) => setDetails(e.target.value)} className="col-span-3" />
                        </div>
                        {geocodingError && (
                            <p className="col-span-4 text-sm text-destructive">{geocodingError}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleGeocodeAndApprove} disabled={isLoading}>
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
