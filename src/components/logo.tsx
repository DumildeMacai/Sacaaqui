import React from 'react';

const SacaaquiIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="icon-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399"/>
                <stop offset="1" stopColor="#A78BFA"/>
            </linearGradient>
        </defs>
        <path d="M24 4C16.268 4 10 10.268 10 18C10 28.5 24 44 24 44C24 44 38 28.5 38 18C38 10.268 31.732 4 24 4Z" fill="url(#icon-gradient)"/>
        <circle cx="24" cy="18" r="6" fill="#111827"/>
    </svg>
);


export function MacaiLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
        <SacaaquiIcon />
        <span className="text-4xl font-bold font-headline text-white">Sacaaqui</span>
    </div>
  );
}
