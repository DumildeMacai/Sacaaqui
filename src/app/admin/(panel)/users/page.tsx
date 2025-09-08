
'use client'

import { UserDataTable } from "@/components/admin/user-data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase/init";


export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Não é necessário definir o setLoading(true) aqui, já é tratado pelo estado inicial
                const usersSnapshot = await getDocs(collection(db, 'users'));
                
                if (usersSnapshot.empty) {
                    setUsers([]);
                } else {
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
                    setUsers(usersData);
                }
            } catch (err: any) {
                console.error(err);
                setError('Falha ao buscar utilizadores. Verifique as regras do Firestore.');
            } finally {
                // Apenas definimos o loading como false depois de tentar buscar os dados
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.email === 'admin@admin.com') {
                fetchUsers();
            } else {
                // Se o utilizador não for o admin, definimos o erro e paramos o carregamento
                setError("Acesso não autorizado.");
                setLoading(false);
            }
        });

        // Cleanup da subscrição quando o componente é desmontado
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
