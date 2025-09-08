
'use client'

import { UserDataTable } from "@/components/admin/user-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { getUsersData } from "@/actions/get-admin-data";
import { auth } from "@/firebase/init";
import { onAuthStateChanged } from "firebase/auth";


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

     useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user && user.email === 'admin@admin.com') {
                try {
                    setLoading(true);
                    const idToken = await user.getIdToken();
                    const result = await getUsersData(idToken);
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    setUsers(result.users || []);
                } catch (err: any) {
                    console.error(err);
                    setError('Falha ao buscar utilizadores. Verifique as permissões e os logs do servidor.');
                } finally {
                    setLoading(false);
                }
            } else {
                 setLoading(false);
                 setError('Acesso não autorizado.');
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
