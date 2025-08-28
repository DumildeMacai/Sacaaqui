
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MacaiLogo } from "@/components/logo";
import { useRouter } from "next/navigation";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLoginPage() {
    const [password, setPassword] = React.useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Senha estática para acesso direto ao painel de admin
        if (password === '1dumilde1@A') { 
            // Salvar um item no sessionStorage para indicar que o admin está "logado"
            // Isto é uma segurança muito básica e não deve ser usado para dados sensíveis.
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            router.replace('/admin/atms');
        } else {
            toast({
                variant: "destructive",
                title: "Erro de Autenticação",
                description: "Senha incorreta. Tente novamente.",
            })
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background dark:bg-muted/40">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <MacaiLogo />
                    </div>
                    <CardTitle className="text-2xl font-headline">Área do Administrador</CardTitle>
                    <CardDescription>
                        Entre com sua senha de administrador.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                             <Label htmlFor="password">Senha</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
