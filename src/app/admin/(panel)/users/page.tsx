

'use client'

import { UserDataTable } from "@/components/admin/user-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { getUsersAction } from "@/actions/get-users";
import { auth } from "@/firebase/init";


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                // We need to pass the user's auth token to the server action
                // so it can verify that the user is an admin.
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    throw new Error("Utilizador não autenticado.");
                }
                
                const result = await getUsersAction();

                if ('error' in result) {
                    throw new Error(result.error);
                }

                setUsers(result.users);

            } catch (err: any) {
                console.error(err);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUsers();
            } else {
                setLoading(false);
                setError("Por favor, faça login para ver os utilizadores.");
            }
        });

        return () => unsubscribe();
    }, []);


    if (error) {
        return <div className="text-destructive text-center">Erro ao carregar os utilizadores. Tente novamente mais tarde.</div>;
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
