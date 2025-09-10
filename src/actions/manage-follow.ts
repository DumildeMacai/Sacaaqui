
'use server';

import { db } from "@/firebase/init";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

interface ToggleFollowInput {
    atmId: string;
    userId: string;
    isFollowing: boolean;
}

export async function toggleFollowAtm({ atmId, userId, isFollowing }: ToggleFollowInput) {
    if (!userId) {
        return { success: false, error: "Utilizador não autenticado." };
    }

    try {
        const followRef = doc(db, 'users', userId, 'follows', atmId);

        if (isFollowing) {
            // If they are currently following, unfollow them by deleting the document
            await deleteDoc(followRef);
        } else {
            // If they are not following, follow them by creating the document
            await setDoc(followRef, {
                followedAt: serverTimestamp()
            });
        }

        // Revalidate the path to update the UI, but the component will also update its local state
        revalidatePath(`/dashboard/atm/${atmId}`); 
        return { success: true };

    } catch (error) {
        console.error("Error toggling follow status:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
        return { success: false, error: `Falha ao ${isFollowing ? 'deixar de seguir' : 'seguir'} o ATM: ${errorMessage}` };
    }
}
