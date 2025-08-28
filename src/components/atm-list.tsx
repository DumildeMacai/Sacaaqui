
'use client';

import { mockAtms } from '@/lib/mock-data'; // Manter importação caso ainda seja necessário para a criação inicial
import { AtmCard } from './atm-card';
import type { Atm } from '@/types';
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/init'; // Importe 'db'
import { doc, updateDoc, arrayUnion, serverTimestamp, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'; // Importe as funções do Firestore
import { Skeleton } from '@/components/ui/skeleton'; // Importar componente Skeleton para estado de carregamento
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info } from 'lucide-react';

export function AtmList({ atms }: { atms: Atm[] }) {
  const [internalAtms, setInternalAtms] = useState<Atm[]>(atms);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    setInternalAtms(atms);
  }, [atms]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Busca o nome do Firestore para garantir consistência
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then(userDoc => {
            if (userDoc.exists()) {
                setCurrentUserName(userDoc.data().name);
            } else {
                // Fallback para displayName ou email se o documento não for encontrado
                setCurrentUserName(user.displayName || user.email || '');
            }
        });
      } else {
        setCurrentUserName('');
      }
    });
    
    return () => unsubscribe(); // Cleanup da autenticação
  }, []);

  const handleStatusUpdate = async (atmId: string, status: 'com_dinheiro' | 'sem_dinheiro') => {
    if (!currentUser) {
      console.warn('Usuário não logado, não pode atualizar o status.');
      // Opcional: Adicionar um toast para notificar o usuário
      return;
    }

    try {
      const atmRef = doc(db, 'atms', atmId);
      const docSnap = await getDoc(atmRef);

      if (!docSnap.exists()) {
        console.error("Documento do ATM não encontrado para atualização.");
        return; 
      }

      const newReport = {
        userId: currentUser.uid,
        status,
        timestamp: new Date().toISOString(),
        userName: currentUserName,
      };

      await updateDoc(atmRef, {
        status: status,
        lastUpdate: serverTimestamp(),
        reports: arrayUnion(newReport),
      });

      const updatedDocSnap = await getDoc(atmRef);
      if (updatedDocSnap.exists()) {
        const updatedAtm = updatedDocSnap.data();

        if (updatedAtm.lastUpdate && typeof updatedAtm.lastUpdate.toDate === 'function') {
            updatedAtm.lastUpdate = updatedAtm.lastUpdate.toDate().toISOString();
        }

        const reports = (updatedAtm.reports || []).map((report: any) => ({
            ...report,
            timestamp: report.timestamp, 
        }));

        setInternalAtms(currentAtms =>
          currentAtms.map(atm =>
            atm.id === atmId
              ? { ...atm, ...updatedAtm, id: atmId, reports } as Atm
              : atm
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status do ATM no Firestore:', error);
    }
  };

  if (internalAtms.length === 0) {
    return (
        <Card className="col-span-full">
            <CardHeader className='flex-row items-center gap-4'>
                <Info className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>Nenhum ATM encontrado</CardTitle>
                    <CardDescription>A sua pesquisa não retornou resultados.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Nenhum ATM encontrado. Se na sua região existem caixas eletrônicos que não estão listados, por favor, de um clique no botão sugerir um ATM situado no lado direito da aplicação para sugerir ao administrador adição do ATM em falta.
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {internalAtms.map(atm => (
        <AtmCard key={atm.id} atm={atm} onStatusUpdate={handleStatusUpdate} />
      ))}
    </div>
  );
}
