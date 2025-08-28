
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


export default function DashboardLayout({
  children,
}: {
 children: React.ReactNode;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserName(userDoc.data().name);
            } else {
                setUserName(user.displayName || user.email || '');
            }
        } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
            setUserName(user.displayName || user.email || '');
        }
        
        if (user.email === 'admin@admin.com') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }

      } else {
        setCurrentUser(null);
        setUserName('');
        setIsAdmin(false);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
           <Skeleton className="h-8 w-24" />
           <div className="ml-auto flex items-center gap-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-16" />
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <MacaiLogo />
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
                {/* Search could go here */}
            </div>
            {userName && (
              <span className="mr-4 text-sm font-medium text-foreground">Olá, {userName}</span>
            )}
            {currentUser && <Notifications userId={currentUser.uid} />}
            {isAdmin && (
                <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard">
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
                </Link>
                </Button>
            )}
           <ThemeToggle />
           <LogoutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
