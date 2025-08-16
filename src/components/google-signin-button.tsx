'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/init';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

// Custom SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.655-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.998,35.986,44,30.606,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export function GoogleSignInButton() {
    const router = useRouter();
    const { toast } = useToast();

    const handleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Create a new user document in Firestore
                await setDoc(userDocRef, {
                    name: user.displayName,
                    email: user.email,
                    dateOfBirth: '', // Google Auth doesn't provide this
                    phoneNumber: user.phoneNumber || '', // May or may not be available
                    reputation: 1, // Initial reputation
                });
            }

            toast({
                title: 'Login Bem-sucedido!',
                description: `Bem-vindo de volta, ${user.displayName || user.email}!`,
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Erro no login com Google:", error);
            toast({
                variant: 'destructive',
                title: 'Erro de Login',
                description: error.message,
            });
        }
    };

    return (
        <Button onClick={handleSignIn} variant="outline" className="w-full bg-white text-gray-700 hover:bg-gray-50 border-gray-300">
            <GoogleIcon className="mr-2 h-5 w-5" />
            Entrar com o Google
        </Button>
    );
}
