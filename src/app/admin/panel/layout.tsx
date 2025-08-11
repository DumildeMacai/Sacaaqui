import { Sidebar } from '@/components/admin/admin-sidebar';
import { MacaiLogo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <MacaiLogo />
                </Link>
            </div>
            <div className="flex-1">
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
                        <Link href="/dashboard">
                            <MacaiLogo />
                        </Link>
                    </div>
                    <div className="flex-1 py-2">
                      <Sidebar />
                    </div>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
                {/* Optional: Add search here */}
            </div>
            <ThemeToggle />
             <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                </Link>
            </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
            {children}
        </main>
      </div>
    </div>
  );
}
