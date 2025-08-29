
import './globals.css';
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';

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
            </ThemeProvider>
        </body>
    </html>
  );
}
