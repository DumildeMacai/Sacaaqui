
'use server';

import { db } from "@/firebase/init";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
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
        const atmRef = doc(db, 'atms', atmId);

        if (isFollowing) {
            // If they are currently following, unfollow them
            await updateDoc(atmRef, {
                followers: arrayRemove(userId)
            });
        } else {
            // If they are not following, follow them
            await updateDoc(atmRef, {
                followers: arrayUnion(userId)
            });
        }

        revalidatePath(`/dashboard/atm/${atmId}`);
        return { success: true };

    } catch (error) {
        console.error("Error toggling follow status:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido";
        return { success: false, error: `Falha ao ${isFollowing ? 'deixar de seguir' : 'seguir'} o ATM: ${errorMessage}` };
    }
}
