
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { auth, db } from '@/firebase/init';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const suggestionSchema = z.object({
    name: z.string().min(5, { message: "O nome deve ter pelo menos 5 caracteres." }),
    address: z.string().min(10, { message: "O endereço deve ser mais detalhado." }),
    details: z.string().optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

const SuggestAtmPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserName, setCurrentUserName] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setCurrentUserName(userDoc.data().name);
                } else {
                    setCurrentUserName(user.displayName || 'Utilizador Anónimo');
                }
            } else {
                toast({ variant: 'destructive', title: 'Acesso Negado', description: 'Você precisa estar logado para fazer uma sugestão.' });
                router.push('/login-email');
            }
        });
        return () => unsubscribe();
    }, [router, toast]);


    const form = useForm<SuggestionFormValues>({
        resolver: zodResolver(suggestionSchema),
        defaultValues: {
            name: '',
            address: '',
            details: '',
        },
    });

    // Function to get the admin user's ID
    const getAdminUserId = async (): Promise<string | null> => {
        try {
            const q = query(collection(db, 'users'), where('email', '==', 'admin@admin.com'));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Return the ID of the first admin found
                return querySnapshot.docs[0].id;
            }
            console.warn("Admin user 'admin@admin.com' not found in users collection.");
            return null;
        } catch (error) {
            console.error("Error fetching admin user ID:", error);
            return null;
        }
    };


    const handleSubmit = async (values: SuggestionFormValues) => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Utilizador não autenticado. Faça login novamente.' });
            return;
        }

        setIsLoading(true);

        try {
            // 1. Add the suggestion
            const newSuggestion = {
                ...values,
                userId: currentUser.uid,
                userName: currentUserName,
                status: 'pending',
                createdAt: serverTimestamp(),
            };
            await addDoc(collection(db, 'atm_suggestions'), newSuggestion);

            // 2. Get admin ID
            const adminId = await getAdminUserId();

            // 3. Create a notification for the admin if adminId is found
            if (adminId) {
                await addDoc(collection(db, 'notifications'), {
                    userId: adminId,
                    title: 'Nova Sugestão de ATM',
                    message: `O utilizador "${currentUserName}" sugeriu um novo ATM: "${values.name}".`,
                    read: false,
                    createdAt: serverTimestamp(),
                    type: 'generic' // or a new type like 'new_suggestion'
                });
            }

            toast({
                title: 'Obrigado pela sua sugestão!',
                description: 'A sua sugestão foi enviada para revisão pelo administrador.',
            });
            router.push('/dashboard');
            
        } catch (error) {
            console.error('Error adding ATM suggestion:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Falha ao guardar a sugestão no servidor. Tente novamente mais tarde.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Sugerir Novo ATM</CardTitle>
                    <CardDescription>
                        Não encontrou um ATM? Preencha os detalhes abaixo e ajude a comunidade. A sua sugestão será revista por um administrador.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do ATM</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Standard Bank - Shoprite" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endereço ou Ponto de Referência</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Av. Deolinda Rodrigues, Gamek, Luanda" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="details"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Detalhes Adicionais (Opcional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ex: Dentro do supermercado, perto da entrada principal." className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading || !currentUser}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Enviar Sugestão
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SuggestAtmPage;
