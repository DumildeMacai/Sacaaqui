'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/init'; 
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginPhone() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para login com email
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true); // Estado para verificar o redirecionamento

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // O utilizador acabou de ser redirecionado de volta do Google
          setIsLoading(true); // Mostra um spinner geral
          const user = result.user;
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Se o utilizador não existir na BD, cria um novo
            await setDoc(userDocRef, {
              name: user.displayName,
              email: user.email,
              dateOfBirth: '',
              phoneNumber: user.phoneNumber || '',
              reputation: 1, // Reputação inicial
            });
          }
          
          toast({
              title: 'Login Bem-sucedido!',
              description: `Bem-vindo de volta, ${user.displayName || user.email}!`,
          });
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error("Erro ao obter resultado do redirecionamento:", error);
        setError(`Erro de login com Google: ${error.message}`);
        toast({
          variant: 'destructive',
          title: 'Erro de Login',
          description: error.message,
        });
      } finally {
        setIsCheckingRedirect(false); // Terminou de verificar, pode mostrar o formulário
      }
    };

    checkRedirectResult();
  }, [router, toast]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      if (email === 'admin@admin.com') {
        router.push('/admin/panel');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      console.error('Erro no login:', err);
      let errorMessage = 'Ocorreu um erro ao tentar fazer o login.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas. Verifique o seu e-mail e senha.';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingRedirect) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">A verificar autenticação...</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm">
        <Button 
            variant="ghost" 
            className="absolute top-4 left-4"
            onClick={() => router.back()}
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Introduza o seu e-mail e senha para aceder à sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'A entrar...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
