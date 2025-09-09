
'use client'

import { UserDataTable } from "@/components/admin/user-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { auth, db } from '@/firebase/init';
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query } from "firebase/firestore";


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.email === 'admin@admin.com') {
                try {
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef);
                    const usersSnapshot = await getDocs(q);

                    const usersData: User[] = usersSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as User[];
                    setUsers(usersData);

                } catch (err: any) {
                    console.error("Error fetching users:", err);
                    setError('Falha ao buscar utilizadores. Verifique as permissões e a conexão.');
                } finally {
                    setLoading(false);
                }
            } else if (!user) {
                 setLoading(false);
                 setError('Acesso não autorizado. Faça login como administrador.');
            }
        });
        return () => unsubscribe();
    }, []);


    if (error) {
        return <div className="text-destructive text-center">{error}</div>;
    }

    if (loading) {
        return (
            <div className="space-y-4">
                 <div className="flex items-center justify-between py-4">
                    <div>
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-80 mt-2" />
                    </div>
                </div>
                <div className="rounded-md border bg-card">
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <UserDataTable data={users} />
        </div>
    )
}
