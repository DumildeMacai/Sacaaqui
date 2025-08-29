
'use client';

import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/firebase/init';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Custom SVG for Facebook Icon
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="white" {...props}>
        <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 6 14.22 6C15.31 6 16.45 6.1 16.45 6.1V8.52H15.19C13.95 8.52 13.56 9.35 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
    </svg>
);

export function FacebookSignInButton() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSignIn = async () => {
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore, if not create a new document
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    name: user.displayName,
                    email: user.email,
                    dateOfBirth: '',
                    phoneNumber: user.phoneNumber || '',
                    reputation: 1, // Initial reputation
                });
            }

            toast({
                title: 'Login Bem-sucedido!',
                description: `Bem-vindo de volta, ${user.displayName || user.email}!`,
            });
            router.push('/dashboard');

        } catch (error: any) {
            console.error("Erro durante o login com Facebook:", error);
            // Handle specific errors, like account existing with a different credential
            if (error.code === 'auth/account-exists-with-different-credential') {
                 toast({
                    variant: 'destructive',
                    title: 'Erro de Login',
                    description: 'Já existe uma conta com este email. Por favor, faça login com o método original.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro de Login',
                    description: `Não foi possível fazer o login com Facebook: ${error.message}`,
                });
            }
        }
    };

    return (
        <Button onClick={handleSignIn} className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white">
            <FacebookIcon className="mr-2 h-5 w-5" />
            Entrar com o Facebook
        </Button>
    );
}
