
'use server';

import { db } from "@/firebase/init";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// O ID do administrador é fixo para garantir que as notificações sejam sempre enviadas para a conta correta.
const ADMIN_USER_ID = 'admin_user_id';

interface CreateSuggestionInput {
    suggestionData: {
        name: string;
        address: string;
        details?: string;
    };
    userId: string;
    userName: string;
}

interface CreateSuggestionOutput {
    success: boolean;
    error?: string;
}

export async function createSuggestionAction(input: CreateSuggestionInput): Promise<CreateSuggestionOutput> {
    const { suggestionData, userId, userName } = input;

    try {
        // Passo 1: Criar a sugestão de ATM
        const newSuggestion = {
            ...suggestionData,
            userId,
            userName,
            status: 'pending',
            createdAt: serverTimestamp(),
        };
        const suggestionDoc = await addDoc(collection(db, 'atm_suggestions'), newSuggestion);

        // Passo 2: Criar a notificação para o administrador
        const notificationPayload = {
            userId: ADMIN_USER_ID,
            title: 'Nova Sugestão de ATM',
            message: `O utilizador ${userName} sugeriu um novo ATM: "${suggestionData.name}".`,
            read: false,
            createdAt: serverTimestamp(),
            type: 'generic', // ou um tipo específico como 'new_suggestion'
            relatedId: suggestionDoc.id, // Opcional: link para a sugestão
        };
        await addDoc(collection(db, 'notifications'), notificationPayload);

        return { success: true };

    } catch (error) {
        console.error("Error creating suggestion and notification:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
        return { success: false, error: `Falha ao processar a sugestão: ${errorMessage}` };
    }
}
