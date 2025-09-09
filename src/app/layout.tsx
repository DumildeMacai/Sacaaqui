
import './globals.css';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body>
            <ThemeProvider>
                {children}
                <Toaster />
            </ThemeProvider>
        </body>
    </html>
  );
}
