
'use client';

import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Loader2 } from "lucide-react";
import { GoogleSignInButton } from '@/components/google-signin-button';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init';
import { FacebookSignInButton } from '@/components/facebook-signin-button';
import { Button } from '@/components/ui/button';
import { MacaiLogo } from '@/components/logo';
import Link from 'next/link';


export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isVerifying, setIsVerifying] = useState(true);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        setIsVerifying(false);
      }
    });

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
    <div className='flex flex-col min-h-screen bg-background text-foreground'>
      <header className="flex justify-between items-center px-6 py-4">
        <MacaiLogo />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-primary" />}
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Bem vindo ao <span className="text-green-400">Sacaaqui</span></h2>
        <p className="text-md sm:text-lg text-muted-foreground mb-8">Escolha uma opção para continuar</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <GoogleSignInButton />
          <FacebookSignInButton />
          <Button
            className="bg-[#28a745] hover:bg-[#218838] text-white"
            asChild
          >
            <Link href="/login-email">Entrar com Email e Senha</Link>
          </Button>
          <Button
            className="bg-[#8A2BE2] hover:bg-[#7B1FA2] text-white"
            asChild
          >
            <Link href="/signup">Criar Conta</Link>
          </Button>
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold mt-8 text-primary">O maior localizador de atms de Angola</h1>
      </main>

      <footer className="w-full py-4 px-6 text-center text-sm text-muted-foreground">
        <p>Feito com muito carinho por: <span className="font-bold">Dumilde Macai</span></p>
        <p>&copy; {new Date().getFullYear()} Todos os direitos autorais reservados.</p>
      </footer>
    </div>
  );
}
