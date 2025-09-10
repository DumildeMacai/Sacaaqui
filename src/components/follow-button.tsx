
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { auth } from '@/firebase/init';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { toggleFollowAtm } from '@/actions/manage-follow';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
    atmId: string;
    followers: string[];
}

export function FollowButton({ atmId, followers }: FollowButtonProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    if (!currentUser) {
        // Don't show the button if the user is not logged in
        return null;
    }

    const isFollowing = followers.includes(currentUser.uid);

    const handleToggleFollow = async () => {
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
        } else {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: result.error,
            });
        }
        setIsLoading(false);
    };


    return (
        <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            onClick={handleToggleFollow}
            disabled={isLoading}
            className="flex-shrink-0"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isFollowing ? (
                <BellOff className="mr-2 h-4 w-4" />
            ) : (
                <Bell className="mr-2 h-4 w-4" />
            )}
            {isFollowing ? 'A Seguir' : 'Seguir'}
        </Button>
    );
}
