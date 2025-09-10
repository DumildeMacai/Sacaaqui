
'use client';

import { AtmCard } from './atm-card';
import type { Atm } from '@/types';
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/init';
import { doc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Info } from 'lucide-react';
import { sendNotificationToFollowers } from '@/actions/send-notification';
import { useToast } from '@/hooks/use-toast';


interface AtmListProps {
    atms: Atm[];
    onCardClick: (atmId: string) => void;
    selectedAtmId: string | null;
}

export function AtmList({ atms, onCardClick, selectedAtmId }: AtmListProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then(userDoc => {
            if (userDoc.exists()) {
                setCurrentUserName(userDoc.data().name);
            } else {
                setCurrentUserName(user.displayName || user.email || '');
            }
        });
      } else {
        setCurrentUserName('');
      }
    });
    
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (atmId: string, status: 'com_dinheiro' | 'sem_dinheiro') => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Ação Bloqueada',
        description: 'Você precisa estar logado para atualizar o status de um ATM.',
      });
      return;
    }
  
    try {
      const atmRef = doc(db, 'atms', atmId);
      const atmDoc = await getDoc(atmRef);
      if (!atmDoc.exists()) {
        throw new Error("ATM não encontrado.");
      }
      
      const atmData = atmDoc.data() as Atm;
      const oldStatus = atmData.status;

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

      toast({
        title: 'Status Atualizado!',
        description: 'Obrigado pela sua contribuição para a comunidade.',
      });

      // Se o status mudou, e especialmente se mudou para 'com_dinheiro', envie notificações.
      if (status !== oldStatus && status === 'com_dinheiro') {
        // Não precisamos esperar por isto, pode correr em segundo plano
        sendNotificationToFollowers({
          atmId: atmId,
          reportingUserName: currentUserName,
        });
      }
  
    } catch (error) {
      console.error('Erro ao atualizar status do ATM no Firestore:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar o status. Tente novamente mais tarde.',
      });
    }
  };

  if (atms.length === 0) {
    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card className="bg-white">
                <CardHeader className='flex-row items-center gap-4'>
                    <Info className="h-8 w-8 text-primary" />
                    <div>
                        <CardTitle>Nenhum ATM encontrado</CardTitle>
                        <CardDescription>A sua pesquisa não retornou resultados.</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <>
      {atms.map(atm => (
        <AtmCard 
            key={atm.id} 
            atm={atm} 
            onStatusUpdate={handleStatusUpdate} 
            onClick={() => onCardClick(atm.id)}
            isSelected={selectedAtmId === atm.id}
        />
      ))}
    </>
  );
}
