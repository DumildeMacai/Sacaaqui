
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
import { MacaiLogo } from '@/components/logo';
import { useTranslations } from 'next-intl';


export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isVerifying, setIsVerifying] = useState(true);
  const isDarkMode = theme === 'dark';
  const t = useTranslations('homepage');

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
    <div className='bg-background text-foreground'>
      <div className="flex justify-between items-center px-6 py-4">
        <MacaiLogo />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-primary" />}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center -mt-16">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: t.raw('welcome') }} />
        <p className="text-md sm:text-lg text-muted-foreground mb-8">{t('description')}</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <GoogleSignInButton />
          <FacebookSignInButton />
          <Button
            className="bg-[#28a745] hover:bg-[#218838] text-white"
            onClick={() => router.push('/login-email')}
          >
            {t('loginButton')}
          </Button>
          <Button
            className="bg-[#8A2BE2] hover:bg-[#7B1FA2] text-white"
            onClick={() => router.push('/signup')}
          >
            {t('signupButton')}
          </Button>
        </div>
      </main>
    </div>
  );
}
