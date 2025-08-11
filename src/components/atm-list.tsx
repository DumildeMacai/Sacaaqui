'use client';

import { mockAtms } from '@/lib/mock-data'; // Manter importação caso ainda seja necessário para a criação inicial
import { AtmCard } from './atm-card';
import type { Atm } from '@/types';
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/init'; // Importe 'db'
import { doc, updateDoc, arrayUnion, serverTimestamp, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'; // Importe as funções do Firestore
import { Skeleton } from '@/components/ui/skeleton'; // Importar componente Skeleton para estado de carregamento
import { onAuthStateChanged, type User } from 'firebase/auth';

export function AtmList({ initialAtms }: { initialAtms: Atm[] }) {
  const [atms, setAtms] = useState<Atm[]>(initialAtms); // Começa com os dados do servidor
  const [loading, setLoading] = useState(false); // Não começa carregando, pois já tem os dados
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserName, setCurrentUserName] = useState(''); // Corrigido para setCurrentUserName

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log('Estado de autenticação alterado. currentUser:', currentUser); // Adicionado para verificar a autenticação
      if (user) {
        setCurrentUserName(user.displayName || user.email || '');
      } else {
        setCurrentUserName('');
      }
    });
    
    return () => unsubscribe(); // Cleanup da autenticação
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  const handleStatusUpdate = async (atmId: string, status: 'com_dinheiro' | 'sem_dinheiro') => { // Torne a função assíncrona
    console.log('handleStatusUpdate chamado para ATM ID:', atmId); // Adicionado para verificar o atmId
    if (!currentUser) {
      console.warn('Usuário não logado, não pode atualizar o status.');
      return;
    }

    try {
      const atmRef = doc(db, 'atms', atmId);

      // Verifica se o documento existe
      const docSnap = await getDoc(atmRef);

      if (!docSnap.exists()) {
        // Se o documento não existe, cria-o com os dados iniciais do mock
        const initialAtm = mockAtms.find(atm => atm.id === atmId);
        if (initialAtm) {
          await setDoc(atmRef, {
            ...initialAtm,
            status: status,
            lastUpdate: serverTimestamp(),
            reports: [], // Inicializa o array de relatórios
          });
          console.log(`Documento ATM ${atmId} criado no Firestore.`);
        } else {
          console.error(`ATM com ID ${atmId} não encontrado nos dados mockados.`);
          return;
        }
      }

      const newReport = {
        userId: currentUser.uid,
        status,
        timestamp: new Date().toISOString(), // Use new Date() para um carimbo de data/hora local
        userName: currentUserName,
      };

      // Agora atualiza o documento (que agora sabemos que existe)
      await updateDoc(atmRef, {
        status: status,
        lastUpdate: serverTimestamp(),
        reports: arrayUnion(newReport),
      });

      console.log(`Status do ATM ${atmId} atualizado para ${status} no Firestore.`);

      // --- Modificação: Buscar dados atualizados do Firestore ---
      const updatedDocSnap = await getDoc(atmRef);
      if (updatedDocSnap.exists()) {
        const updatedAtm = updatedDocSnap.data() as any;

        // --- Modificação: Converter Firestore Timestamp para Date ---
        // Verifica se lastUpdate existe e não é uma string antes de converter
        if (updatedAtm.lastUpdate && typeof updatedAtm.lastUpdate !== 'string') {
            // Assumimos que se não é string e existe, é um Timestamp do Firestore
            updatedAtm.lastUpdate = (updatedAtm.lastUpdate as any).toDate().toISOString();
        }
        // --- Fim da Modificação ---

        setAtms(currentAtms =>
          currentAtms.map(atm =>
            atm.id === atmId
              ? { ...updatedAtm, id: atmId } as Atm // Use os dados completos e atualizados do Firestore
              : atm
          )
        );
        console.log(`Estado local do ATM ${atmId} atualizado com dados do Firestore.`);
      } else {
        console.warn(`Documento do ATM ${atmId} não encontrado após atualização.`);
      }
      // --- Fim da Modificação ---

    } catch (error) {
      console.error('Erro ao atualizar status do ATM no Firestore:', error);
    }
  };

  return (
    <>
      <div className="mb-4 text-right text-gray-400">
        {currentUserName && `Logado como: ${currentUserName}`}
      </div>
      {loading ? (
        // --- Modificação: Exibir esqueleto de carregamento ---
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[220px] w-full rounded-xl" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </div>
      ) : (
        // --- Modificação: Exibir lista de ATMs após o carregamento ---
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {atms.map(atm => {
            // Adiciona uma verificação para garantir que 'atm' não é nulo ou indefinido
            if (!atm) {
              console.warn("Item inválido encontrado na lista de ATMs:", atm);
              return null; // Não renderiza o AtmCard para itens inválidos
            }
            // Adiciona uma verificação para garantir que 'status' existe e é válido
            if (!atm.status || !['com_dinheiro', 'sem_dinheiro', 'desconhecido'].includes(atm.status as any)) {
               console.warn("ATM com status inválido encontrado:", atm);
               return null; // Não renderiza o AtmCard para ATMs com status inválido
            }

            return (
              <AtmCard key={atm.id} atm={atm} onStatusUpdate={handleStatusUpdate} />
            );
          })}
        </div>
      )}
    </>
  );
}
