
'use server';

import { getAdminDb } from '@/firebase/admin';
import type { User } from '@/types';
import { headers } from 'next/headers';
import { auth } from 'firebase-admin';

// Helper function to verify the user's token and check if they are an admin.
async function verifyAdmin(): Promise<boolean> {
    const authorization = headers().get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        // No authorization header, assume not admin.
        return false;
    }
    const idToken = authorization.split('Bearer ')[1];

    try {
        const decodedToken = await auth().verifyIdToken(idToken);
        // Check if the user is the specific admin user.
        return decodedToken.email === 'admin@admin.com';
    } catch (error) {
        // Token verification failed (invalid, expired, etc.)
        console.error("Error verifying admin token:", error);
        return false;
    }
}


export async function getUsersAction(): Promise<{ users: User[] } | { error: string }> {
    try {
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
