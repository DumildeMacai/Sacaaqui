
'use client';

import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Loader2 } from "lucide-react";
import { GoogleSignInButton } from '@/components/google-signin-button';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/firebase/init';
import { useToast } from '@/hooks/use-toast';
import { FacebookSignInButton } from '@/components/facebook-signin-button';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isVerifying, setIsVerifying] = useState(true);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    // onAuthStateChanged is enough to check if the user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user object exists, they are logged in, redirect to dashboard
        router.push('/dashboard');
      } else {
        // If no user, we can stop verifying and show the login page
        setIsVerifying(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);


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
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"></path><path d="M12 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"></path><path d="M2 12h20"></path></svg>
            Dumilde Macai
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-primary" />}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center -mt-16">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Bem-vindo ao <span className="text-accent">Sacaaqui</span></h2>
        <p className="text-md sm:text-lg text-muted-foreground mb-8">Escolha uma opção para continuar</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <GoogleSignInButton />
          <FacebookSignInButton />
          <Button
            className="bg-[#28a745] hover:bg-[#218838] text-white"
            onClick={() => router.push('/login-email')}
          >
            Entrar com Email e Senha
          </Button>
          <Button
            className="bg-[#8A2BE2] hover:bg-[#7B1FA2] text-white"
            onClick={() => router.push('/signup')}
          >
            Criar Conta
          </Button>
        </div>
      </main>
    </div>
  );
}
