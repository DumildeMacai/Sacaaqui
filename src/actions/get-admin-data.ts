
'use server';

import { headers } from 'next/headers';
import { adminDb, adminAuth } from '@/firebase/admin';
import type { Atm, User } from '@/types';
import type { DashboardData } from '@/app/admin/(panel)/dashboard/page';

async function verifyAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const authorization = headers().get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return { isAdmin: false, error: 'No token provided' };
    }
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (decodedToken.email !== 'admin@admin.com') {
      return { isAdmin: false, error: 'User is not admin' };
    }
    
    return { isAdmin: true };
  } catch (error: any) {
    console.error("Admin verification failed:", error);
    return { isAdmin: false, error: error.message || 'Token verification failed' };
  }
}

export async function getDashboardData(): Promise<{ data?: DashboardData; error?: string; }> {
    const authResult = await verifyAdmin();
    if (!authResult.isAdmin) {
        return { error: `Acesso não autorizado: ${authResult.error}` };
    }
    
    try {
        const atmsRef = adminDb.collection("atms");
        const usersRef = adminDb.collection("users");

        const [atmsSnapshot, usersSnapshot] = await Promise.all([
            atmsRef.get(),
            usersRef.get()
        ]);

        const atmCount = atmsSnapshot.size;
        const userCount = usersSnapshot.size;

        const statusCounts: { [key in Atm['status']]: number } = {
            com_dinheiro: 0,
            sem_dinheiro: 0,
            desconhecido: 0,
        };

        atmsSnapshot.forEach(doc => {
            const atm = doc.data() as Omit<Atm, 'id'>;
            if (atm.status && statusCounts[atm.status] !== undefined) {
                statusCounts[atm.status]++;
            }
        });
        
        const chartData = [
            { name: 'Com Dinheiro', value: statusCounts.com_dinheiro, fill: "var(--color-com_dinheiro)" },
            { name: 'Sem Dinheiro', value: statusCounts.sem_dinheiro, fill: "var(--color-sem_dinheiro)"  },
            { name: 'Desconhecido', value: statusCounts.desconhecido, fill: "var(--color-desconhecido)"  },
        ];

        return { data: { atmCount, userCount, chartData } };
    } catch (error: any) {
        console.error("Error fetching dashboard data with Admin SDK:", error);
        return { error: `Falha ao obter dados do dashboard: ${error.message}` };
    }
}


export async function getUsersData(): Promise<{ users?: User[]; error?: string; }> {
    const authResult = await verifyAdmin();
    if (!authResult.isAdmin) {
        return { error: `Acesso não autorizado: ${authResult.error}` };
    }

    try {
        const usersSnapshot = await adminDb.collection('users').get();
        if (usersSnapshot.empty) {
            return { users: [] };
        }
        
        const usersData: User[] = usersSnapshot.docs.map(doc => {
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

        return { users: usersData };
    } catch (error: any) {
        console.error("Error fetching users with Admin SDK:", error);
        return { error: `Falha ao obter utilizadores: ${error.message}` };
    }
}
