
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// This is the new root page, which detects the user's language and redirects.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const browserLang = navigator.language || 'en-US';
    // Redirect to the detected locale
    if (browserLang.startsWith('pt')) {
      router.replace('/pt-BR');
    } else {
      router.replace('/en-US');
    }
  }, [router]);

  // Render a loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
