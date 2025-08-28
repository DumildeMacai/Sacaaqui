
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { submitAtmSuggestion } from '@/actions/suggest-atm';
import { useForm, zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const suggestionSchema = z.object({
    name: z.string().min(5, { message: "O nome deve ter pelo menos 5 caracteres." }),
    address: z.string().min(10, { message: "O endereço deve ser mais detalhado." }),
    details: z.string().optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

const SuggestAtmPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<SuggestionFormValues>({
        resolver: zodResolver(suggestionSchema),
        defaultValues: {
            name: '',
            address: '',
            details: '',
        },
    });

    const handleSubmit = async (values: SuggestionFormValues) => {
        setIsLoading(true);
        try {
            await submitAtmSuggestion(values);
            toast({
                title: 'Obrigado pela sua sugestão!',
                description: 'A sua sugestão foi enviada para revisão pelo administrador.',
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Error submitting suggestion:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível enviar a sua sugestão. Tente novamente.',
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
                                <Button type="submit" disabled={isLoading}>
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
