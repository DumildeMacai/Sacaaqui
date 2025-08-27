
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
    <div>
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">🌐 Dumilde Macai </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-800 transition"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-center">Bem-vindo ao <span className="text-green-400">Sacaaqui</span></h2>
        <p className="text-md sm:text-lg text-center mb-8 opacity-80">Escolha uma opção para continuar</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <GoogleSignInButton />
          <FacebookSignInButton />
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow-lg transition-all text-sm font-medium"
            onClick={() => router.push('/login-email')}
          >
            Entrar com Email e Senha
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl shadow-lg transition-all text-sm font-medium"
            onClick={() => router.push('/signup')}
          >
            Criar Conta
          </button>
        </div>
      </main>
    </div>
  );
}
