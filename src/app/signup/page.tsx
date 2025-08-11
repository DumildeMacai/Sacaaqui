"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '@/firebase/init';

export default function SignupPage() {
  const router = useRouter();

  // Estados
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  // Lógica de cadastro
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !dateOfBirth || !phone) {
      return setError("Por favor, preencha todos os campos.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          name,
          email: user.email,
          dateOfBirth,
          phoneNumber: phone
        });

        console.log("Usuário criado e salvo no Firestore:", user);
        router.push("/dashboard");
      }

    } catch (err: any) {
      console.error("Erro ao criar usuário:", err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso.");
      } else if (err.code === 'auth/weak-password') {
        setError("Senha fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Erro ao criar conta: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="max-w-sm w-full space-y-4">
        <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

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

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-300">Data de Nascimento</label>
            <input
              type="date"
              id="dob"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Número de Telefone</label>
            <input
              type="tel"
              id="phone"
              placeholder="Ex: +244900000000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Criar Conta
          </button>
        </form>

        {error && <p className="text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}
