
'use server';

import { z } from 'zod';
import { auth, db } from '@/firebase/init';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { User } from '@/types';

const suggestionSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    details: z.string().optional(),
});

export type AtmSuggestionInput = z.infer<typeof suggestionSchema>;

export async function submitAtmSuggestion(input: AtmSuggestionInput): Promise<{ id: string }> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
        throw new Error('Utilizador não autenticado.');
    }

    const parsedInput = suggestionSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error('Dados inválidos.');
    }

    // Get user's name from 'users' collection
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userName = userDoc.exists() ? (userDoc.data() as User).name : currentUser.displayName || 'Utilizador Anónimo';

    const newSuggestion = {
        ...parsedInput.data,
        userId: currentUser.uid,
        userName: userName,
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
