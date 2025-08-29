
'use client';

import { Sidebar } from '@/components/admin/admin-sidebar';
import { MacaiLogo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { auth } from '@/firebase/init';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Menu, LogOut, Loader2, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if user is logged in and is the admin
      if (user && user.email === 'admin@admin.com') {
        setIsLoading(false);
      } else {
        // If not admin or not logged in, redirect to home
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
     signOut(auth).then(() => {
        router.push('/');
    }).catch((error) => {
        console.error('Logout Error:', error);
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                    <MacaiLogo />
                    <span className="">Admin</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <Sidebar />
            </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                     <div className="flex h-14 items-center border-b px-4">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                            <MacaiLogo />
                             <span className="">Admin</span>
                        </Link>
                    </div>
                    <div className="flex-1 py-2 overflow-auto">
                      <Sidebar />
                    </div>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
            </div>
            <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Painel do Utilizador
                </Link>
            </Button>
            <ThemeToggle />
             <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="h-5 w-5" />
                 <span className="sr-only">Sair</span>
            </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
            {children}
        </main>
      </div>
    </div>
  );
}
