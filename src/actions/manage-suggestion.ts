
'use server';

import { db } from "@/firebase/init";
import { addDoc, collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

interface ApproveSuggestionInput {
    suggestionId: string;
    userId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    details?: string;
}

export async function handleApproveSuggestion(input: ApproveSuggestionInput) {
    if (!input.name || !input.address || isNaN(input.lat) || isNaN(input.lng)) {
        return { success: false, error: "Nome, endereço, latitude e longitude válidos são obrigatórios." };
    }

    try {
        const newAtmPayload = {
            name: input.name,
            address: input.address,
            location: {
                lat: input.lat, 
                lng: input.lng,
            },
            details: input.details || '',
            status: 'desconhecido',
            lastUpdate: serverTimestamp(),
            reports: [],
        };
        await addDoc(collection(db, 'atms'), newAtmPayload);

        const suggestionRef = doc(db, 'atm_suggestions', input.suggestionId);
        await updateDoc(suggestionRef, {
            status: 'approved'
        });

        if (input.userId) {
            await addDoc(collection(db, 'notifications'), {
                userId: input.userId,
                title: 'Sugestão Aprovada!',
                message: `O ATM "${input.name}" que você sugeriu foi aprovado e adicionado ao mapa. Obrigado por sua contribuição!`,
                read: false,
                createdAt: serverTimestamp(),
                type: 'suggestion_approved'
            });
        }

        revalidatePath('/admin/suggestions');
        revalidatePath('/dashboard');

        return { success: true };

    } catch (error) {
        console.error("Error approving suggestion:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
        return { success: false, error: `Falha ao aprovar a sugestão: ${errorMessage}` };
    }
}


interface RejectSuggestionInput {
    suggestionId: string;
    suggestionName: string;
    userId: string;
}

export async function handleRejectSuggestion(input: RejectSuggestionInput) {
    try {
        const suggestionRef = doc(db, 'atm_suggestions', input.suggestionId);
        await updateDoc(suggestionRef, {
            status: 'rejected'
        });

        if (input.userId) {
            await addDoc(collection(db, 'notifications'), {
                userId: input.userId,
                title: 'Sugestão Rejeitada',
                message: `A sua sugestão para o ATM "${input.suggestionName}" foi revista mas não pôde ser aprovada neste momento.`,
                read: false,
                createdAt: serverTimestamp(),
                type: 'suggestion_rejected'
            });
        }

        revalidatePath('/admin/suggestions');

        return { success: true };
    } catch (error) {
        console.error("Error rejecting suggestion:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
        return { success: false, error: `Falha ao rejeitar a sugestão: ${errorMessage}` };
    }
}
