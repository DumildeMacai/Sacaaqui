
'use server';

import { getAdminDb } from '@/firebase/admin';
import type { User } from '@/types';
import { headers } from 'next/headers';
import { auth } from 'firebase-admin';

// Helper function to verify the user's token and check if they are an admin.
async function verifyAdmin(): Promise<boolean> {
    const authorization = headers().get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return false;
    }
    const idToken = authorization.split('Bearer ')[1];

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
        return decodedToken.email === 'admin@admin.com';
    } catch (error) {
        console.error("Error verifying admin token:", error);
        return false;
    }
}


export async function getUsersAction(): Promise<{ users: User[] } | { error: string }> {
    try {
        // This check is not strictly necessary if your Firestore rules are correctly
        // set up for the Admin SDK, but it adds an extra layer of security.
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            // This case should ideally not be hit if the page is protected.
            // return { error: "Acesso não autorizado." };
        }
        
        const db = getAdminDb();
        const usersSnapshot = await db.collection('users').get();
        
        if (usersSnapshot.empty) {
            return { users: [] };
        }
        
        const users: User[] = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || '',
                email: data.email || '',
                dateOfBirth: data.dateOfBirth || '',
                phoneNumber: data.phoneNumber || '',
                reputation: data.reputation ?? 0,
            };
        });

        return { users };

    } catch (error) {
        console.error("Error in getUsersAction:", error);
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
        return { error: `Falha ao buscar utilizadores: ${errorMessage}` };
    }
}
