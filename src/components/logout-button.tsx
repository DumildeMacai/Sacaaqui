// src/components/logout-button.tsx
'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/init'; // Importe a instância de autenticação
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assumindo que você quer usar o componente Button de ui

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuário deslogado');
      router.push('/'); // Redirecionar para a página inicial após o logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" // Use as classes que você já tinha
    >
      Sair
    </Button>
  );
}