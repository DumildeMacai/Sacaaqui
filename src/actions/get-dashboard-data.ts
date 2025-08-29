
'use server';

import { getAdminDb } from "@/firebase/admin";
import type { Atm } from "@/types";

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
        const adminDb = getAdminDb();
        const atmsRef = adminDb.collection("atms");
        const usersRef = adminDb.collection("users");

        const [atmsSnapshot, usersSnapshot] = await Promise.all([
            atmsRef.count().get(),
            usersRef.count().get()
        ]);

        const atmCount = atmsSnapshot.data().count;
        const userCount = usersSnapshot.data().count;

        // Fetch all ATMs to calculate status distribution
        const allAtmsSnapshot = await atmsRef.get();
        const statusCounts: { [key in Atm['status']]: number } = {
            com_dinheiro: 0,
            sem_dinheiro: 0,
            desconhecido: 0,
        };

        allAtmsSnapshot.forEach(doc => {
            const atm = doc.data() as Omit<Atm, 'id'>;
            if (statusCounts[atm.status] !== undefined) {
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
        console.error("Error fetching dashboard data with Admin SDK:", error);
        throw new Error('Failed to fetch dashboard data. Check server logs and Firestore permissions for the service account.');
    }
}
