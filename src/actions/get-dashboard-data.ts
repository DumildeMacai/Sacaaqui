
'use server';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/init';
import type { Atm } from '@/types';

export interface DashboardData {
    atmCount: number;
    userCount: number;
    chartData: {
        name: string;
        value: number;
        fill: string;
    }[];
}

export async function getDashboardData(): Promise<DashboardData> {
    try {
        // NOTE: This now uses the CLIENT SDK.
        // Make sure your Firestore rules allow the admin user to read these collections.
        const atmsRef = collection(db, "atms");
        const usersRef = collection(db, "users");

        // Fetching documents using the client SDK. The currently logged-in user's
        // authentication state (and custom claims, if any) will be used by Firestore
        // to evaluate security rules.
        const [atmsSnapshot, usersSnapshot] = await Promise.all([
            getDocs(atmsRef),
            getDocs(usersRef)
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

        return {
            atmCount,
            userCount,
            chartData,
        };

    } catch (error) {
        console.error("Error fetching dashboard data with Client SDK in Server Action:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        // This error will be caught by the page and displayed to the user.
        throw new Error(`Failed to fetch dashboard data. Check browser console and Firestore rules. Details: ${errorMessage}`);
    }
}
