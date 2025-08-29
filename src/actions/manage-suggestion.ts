
'use server';

import { db } from "@/firebase/init";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
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
    // Validação para garantir que os campos obrigatórios existem e são do tipo correto
    const latNum = typeof input.lat === 'string' ? parseFloat(input.lat) : input.lat;
    const lngNum = typeof input.lng === 'string' ? parseFloat(input.lng) : input.lng;

    if (!input.name || !input.address || isNaN(latNum) || isNaN(lngNum)) {
        return { success: false, error: "Nome, endereço, latitude e longitude válidos são obrigatórios." };
    }

    try {
        // 1. Create the new ATM document
        const newAtmPayload = {
            name: input.name,
            address: input.address,
            location: {
                lat: latNum,
                lng: lngNum,
            },
            details: input.details || '',
            status: 'desconhecido',
            lastUpdate: serverTimestamp(),
            reports: [],
        };
        await addDoc(collection(db, 'atms'), newAtmPayload);

        // 2. Update the suggestion status to 'approved'
        const suggestionRef = doc(db, 'atm_suggestions', input.suggestionId);
        await updateDoc(suggestionRef, {
            status: 'approved'
        });

        // 3. Create a notification for the user, only if userId is present
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
        return { success: false, error: "Falha ao aprovar a sugestão." };
    }
}


interface RejectSuggestionInput {
    suggestionId: string;
    suggestionName: string;
    userId: string;
}

export async function handleRejectSuggestion(input: RejectSuggestionInput) {
    try {
        // 1. Update the suggestion status to 'rejected'
        const suggestionRef = doc(db, 'atm_suggestions', input.suggestionId);
        await updateDoc(suggestionRef, {
            status: 'rejected'
        });

        // 2. Create a notification for the user, only if userId is present
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
        return { success: false, error: "Falha ao rejeitar a sugestão." };
    }
}
