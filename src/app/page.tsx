
'use client';

import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Loader2 } from "lucide-react";
import { GoogleSignInButton } from '@/components/google-signin-button';
import { useEffect, useState } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth, db } from '@/firebase/init';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { FacebookSignInButton } from '@/components/facebook-signin-button';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has just been redirected from Google Sign-In
          const user = result.user;
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // Create a new user document if it doesn't exist
            await setDoc(userDocRef, {
              name: user.displayName,
              email: user.email,
              dateOfBirth: '',
              phoneNumber: user.phoneNumber || '',
              reputation: 1, // Initial reputation
            });
          }
          
          toast({
              title: 'Login Bem-sucedido!',
              description: `Bem-vindo de volta, ${user.displayName || user.email}!`,
          });
          router.push('/dashboard');
        } else {
            setIsVerifying(false);
        }
      } catch (error: any) {
        console.error("Erro ao obter resultado do redirecionamento:", error);
        toast({
          variant: 'destructive',
          title: 'Erro de Login',
          description: error.message,
        });
        setIsVerifying(false);
      }
    };

    checkRedirectResult();
  }, [router, toast]);


  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">A verificar autenticação...</p>
      </div>
    );
  }


  return (
    <div className='bg-background text-foreground'>
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">🌐 Macai ATM Locator</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-primary" />}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center -mt-16">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Bem-vindo ao <span className="text-primary">ATM Locator</span></h2>
        <p className="text-md sm:text-lg text-muted-foreground mb-8">Escolha uma opção para continuar</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <GoogleSignInButton />
          <FacebookSignInButton />
          <Button
            variant="secondary"
            onClick={() => router.push('/login-email')}
          >
            Login com Email e Password
          </Button>
          <Button
            variant="default"
            onClick={() => router.push('/signup')}
          >
            Criar Conta
          </Button>
        </div>
      </main>
    </div>
  );
}
