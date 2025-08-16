'use client';

import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { Sun, Moon } from "lucide-react";
import { GoogleSignInButton } from '@/components/google-signin-button';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div>
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">🌐 Macai ATM Locator</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-800 transition"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-center">Bem-vindo ao <span className="text-green-400">ATM Locator</span></h2>
        <p className="text-md sm:text-lg text-center mb-8 opacity-80">Escolha uma opção para continuar</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <GoogleSignInButton />
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow-lg transition-all text-sm font-medium"
            onClick={() => router.push('/login-email')}
          >
            Entrar com Email e Senha
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl shadow-lg transition-all text-sm font-medium"
            onClick={() => router.push('/signup')}
          >
            Criar Conta
          </button>
        </div>
      </main>
    </div>
  );
}
