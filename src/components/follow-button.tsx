
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { auth, db } from '@/firebase/init';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { toggleFollowAtm } from '@/actions/manage-follow';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot } from 'firebase/firestore';

interface FollowButtonProps {
    atmId: string;
}

export function FollowButton({ atmId }: FollowButtonProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start loading until we check status
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            // If user logs out, stop loading and reset state
            if (!user) {
                setIsFollowing(false);
                setIsLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!currentUser) {
            // If there's no user, we are not loading the follow status.
            setIsLoading(false);
            return;
        };

        setIsLoading(true);
        const followDocRef = doc(db, 'users', currentUser.uid, 'follows', atmId);

        const unsubscribeSnapshot = onSnapshot(followDocRef, (doc) => {
            setIsFollowing(doc.exists());
            setIsLoading(false);
        }, (error) => {
            console.error("Error checking follow status:", error);
            setIsLoading(false);
        });

        return () => unsubscribeSnapshot();
    }, [currentUser, atmId]);

    const handleToggleFollow = async () => {
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Acesso Negado', description: 'Você precisa estar logado para seguir um ATM.' });
            return;
        }

        setIsLoading(true);
        const result = await toggleFollowAtm({
            atmId,
            userId: currentUser.uid,
            isFollowing,
        });

        if (result.success) {
            toast({
                title: isFollowing ? 'Deixou de seguir' : 'A seguir!',
                description: isFollowing
                    ? 'Você não receberá mais notificações para este ATM.'
                    : 'Você será notificado quando este ATM tiver dinheiro.',
            });
            // The onSnapshot listener will automatically update the UI state.
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: result.error,
            });
        }
        // Always set loading to false after the operation is complete.
        setIsLoading(false);
    };

    if (!currentUser) {
        return null;
    }

    return (
        <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleFollow}
            disabled={isLoading}
            className="flex-shrink-0 w-28" // Fixed width to prevent layout shift
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <>
                    <BellOff className="mr-2 h-4 w-4" />
                    A Seguir
                </>
            ) : (
                <>
                    <Bell className="mr-2 h-4 w-4" />
                    Seguir
                </>
            )}
        </Button>
    );
}
