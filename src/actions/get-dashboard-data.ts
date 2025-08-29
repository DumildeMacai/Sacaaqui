
'use server';

import { db } from "@/firebase/init";
import { collection, getDocs } from "firebase/firestore";
import type { Atm, User } from "@/types";

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
        const atmsQuery = collection(db, "atms");
        const usersQuery = collection(db, "users");

        const [atmsSnapshot, usersSnapshot] = await Promise.all([
            getDocs(atmsQuery),
            getDocs(usersQuery)
        ]);

        // ATM Data
        const atmCount = atmsSnapshot.size;
        
        const statusCounts: { [key in Atm['status']]: number } = {
            com_dinheiro: 0,
            sem_dinheiro: 0,
            desconhecido: 0,
        };

        atmsSnapshot.forEach(doc => {
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

        // User Data
        const userCount = usersSnapshot.size;

        return {
            atmCount,
            userCount,
            chartData,
        };

    } catch (error) {
        console.error("Error fetching dashboard data via server action:", error);
        throw new Error('Failed to fetch dashboard data. Check server logs and Firestore permissions.');
    }
}
