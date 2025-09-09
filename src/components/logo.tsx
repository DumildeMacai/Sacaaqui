import React from 'react';
import { LocateFixed } from 'lucide-react';

export function MacaiLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
        <LocateFixed className="h-8 w-8" />
        <span className="text-2xl font-bold font-headline">Sacaaqui</span>
    </div>
  );
}
