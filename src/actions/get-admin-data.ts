
'use server';

import { getAdminServices } from "@/firebase/admin";
import type { Atm, User } from "@/types";

interface AdminVerificationResult {
    isAdmin: boolean;
    error?: string;
}

// Verifica se o utilizador é um administrador
async function verifyAdmin(token: string): Promise<AdminVerificationResult> {
    try {
        const { auth } = getAdminServices();
        const decodedToken = await auth.verifyIdToken(token);
        
        if (decodedToken.email === 'admin@admin.com') {
            return { isAdmin: true };
        } else {
            return { isAdmin: false, error: 'Utilizador não é um administrador.' };
        }
    } catch (error) {
        console.error("Erro na verificação do token:", error);
        return { isAdmin: false, error: 'Token inválido ou expirado.' };
    }
}


// Server Action para buscar os dados do dashboard
export async function getDashboardData(token: string) {
    const adminCheck = await verifyAdmin(token);
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }

    try {
        const { db } = getAdminServices();
        const atmsSnapshot = await db.collection('atms').get();
        const usersSnapshot = await db.collection('users').get();
        
        const atms = atmsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Omit<Atm, 'lastUpdate' | 'reports'>[];

        return {
            success: true,
            data: {
                atmCount: atmsSnapshot.size,
                userCount: usersSnapshot.size,
                atms: atms,
            }
        };
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard (server):", error);
        return { success: false, error: 'Falha ao buscar dados do Firestore.' };
    }
}


// Server Action para buscar a lista de utilizadores
export async function getUsersData(token: string) {
    const adminCheck = await verifyAdmin(token);
    if (!adminCheck.isAdmin) {
        return { success: false, error: adminCheck.error };
    }
    
    try {
        const { db } = getAdminServices();
        const usersSnapshot = await db.collection('users').get();

        const users: User[] = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];

        return { success: true, data: users };
    } catch (error) {
        console.error("Erro ao buscar utilizadores (server):", error);
        return { success: false, error: 'Falha ao buscar utilizadores do Firestore.' };
    }
}
