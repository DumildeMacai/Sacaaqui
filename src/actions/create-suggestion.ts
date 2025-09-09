
'use server';

import { getAdminDb } from "@/firebase/admin";
import { firestore } from "firebase-admin";

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
        const adminDb = getAdminDb();
        
        // Use a batch to ensure both operations succeed or fail together
        const batch = adminDb.batch();

        // Step 1: Create the ATM suggestion
        const suggestionRef = adminDb.collection('atm_suggestions').doc();
        const newSuggestion = {
            ...suggestionData,
            userId,
            userName,
            status: 'pending',
            createdAt: firestore.FieldValue.serverTimestamp(),
        };
        batch.set(suggestionRef, newSuggestion);

        // Step 2: Create the notification for the administrator
        const notificationRef = adminDb.collection('notifications').doc();
        const notificationPayload = {
            userId: ADMIN_USER_ID,
            title: 'Nova Sugestão de ATM',
            message: `O utilizador ${userName} sugeriu um novo ATM: "${suggestionData.name}".`,
            read: false,
            createdAt: firestore.FieldValue.serverTimestamp(),
            type: 'generic', 
            relatedId: suggestionRef.id,
        };
        batch.set(notificationRef, notificationPayload);
        
        await batch.commit();

        return { success: true };

    } catch (error) {
        console.error("Error creating suggestion and notification with Admin SDK:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
        return { success: false, error: `Falha ao processar a sugestão: ${errorMessage}` };
    }
}
