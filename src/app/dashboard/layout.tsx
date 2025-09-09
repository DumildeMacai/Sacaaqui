
'use client';
import { MacaiLogo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/init';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoutButton } from '@/components/logout-button';
import { Notifications } from '@/components/notifications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function DashboardLayout({
  children,
}: {
 children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        if (user.email === 'admin@admin.com') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 shadow-sm md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <MacaiLogo />
          </Link>
        
        <div className="ml-auto flex items-center gap-4">
            {loading ? (
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-16" />
                </div>
            ) : (
            <>
                {currentUser && <p className="text-sm text-gray-700 hidden md:block">Olá, {currentUser.displayName}</p>}
                {currentUser && <Notifications userId={currentUser.uid} />}
                {isAdmin && (
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/dashboard">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin
                        </Link>
                    </Button>
                )}
                <ThemeToggle />
                <LogoutButton />
            </>
            )}
        </div>
      </header>
      <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
