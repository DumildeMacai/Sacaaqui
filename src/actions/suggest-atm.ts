
'use server';

import { z } from 'zod';
import { db } from '@/firebase/init';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const suggestionSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    details: z.string().optional(),
    userId: z.string(),
    userName: z.string(),
});

export type AtmSuggestionInput = z.infer<typeof suggestionSchema>;

export async function submitAtmSuggestion(input: AtmSuggestionInput): Promise<{ id: string }> {

    const parsedInput = suggestionSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error('Dados inválidos.');
    }

    const { name, address, details, userId, userName } = parsedInput.data;

    const newSuggestion = {
        name,
        address,
        details,
        userId,
        userName,
        status: 'pending', // pending, approved, rejected
        createdAt: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(collection(db, 'atm_suggestions'), newSuggestion);
        return { id: docRef.id };
    } catch (error) {
        console.error('Error adding ATM suggestion:', error);
        throw new Error('Falha ao guardar a sugestão no servidor.');
    }
}
