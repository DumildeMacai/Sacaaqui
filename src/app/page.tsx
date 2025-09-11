
'use client';

import { useRouter } from 'next/navigation';
import { Loader2, Mail, UserPlus } from "lucide-react";
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
  const [isVerifying, setIsVerifying] = useState(true);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <p className="mt-4 text-slate-400">A verificar autenticação...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white'>
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-sm space-y-8">
          <header className="flex flex-col items-center gap-4">
            <MacaiLogo />
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Bem-vindo ao Sacaaqui</h1>
                <p className="text-lg text-indigo-200 mt-2">Encontre ATMs disponíveis em Angola de forma rápida.</p>
            </div>
          </header>

          <div className="flex flex-col gap-4">
            <GoogleSignInButton />
            <FacebookSignInButton />
            <Button
              size="xl"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold justify-start text-base"
              asChild
            >
              <Link href="/login-email">
                  <Mail className="mr-4 h-6 w-6" />
                  Continuar com Email
              </Link>
            </Button>
            <Button
              size="xl"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold justify-start text-base"
              asChild
            >
              <Link href="/signup">
                <UserPlus className="mr-4 h-6 w-6" />
                Criar Conta
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-4">
             <h2 className="text-xl font-medium text-indigo-200 flex items-center justify-center gap-2">
                O maior localizador de ATMs em Angola
            </h2>
             <p className="text-sm text-indigo-300">&copy; {new Date().getFullYear()} Sacaaqui.</p>
             <p className="text-xs text-indigo-400/70">Feito por Dumilde Macai</p>
          </div>
        </div>
      </main>
    </div>
  );
}
