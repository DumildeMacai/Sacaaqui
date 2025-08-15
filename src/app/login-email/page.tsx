'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/firebase/init'; // ajuste esse caminho conforme a estrutura do seu projeto

export default function LoginPhone() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Limpa erros anteriores
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login bem-sucedido, redirecionar
      if (email === 'admin@admin.com' && password === '1dumilde1@A') {
        router.push('/admin/panel');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(`Erro no login: ${err.message}`); // Atualiza o estado de erro com a mensagem do Firebase
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-4">
        <h2 className="text-2xl font-bold mb-2">Login via E-mail</h2>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            required
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Entrar
        </button>

        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
}