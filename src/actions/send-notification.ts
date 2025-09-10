
'use server';

import { db } from "@/firebase/init";
import { collectionGroup, getDocs, query, where, writeBatch, doc, serverTimestamp, getDoc } from "firebase/firestore";
import type { Atm } from "@/types";

interface SendNotificationInput {
    atmId: string;
    reportingUserName: string;
}

/**
 * Sends a notification to all users following a specific ATM.
 * This function now uses a collectionGroup query to find all users who follow the ATM.
 */
export async function sendNotificationToFollowers(input: SendNotificationInput): Promise<{ success: boolean, error?: string }> {
    try {
        // First, get the ATM's name
        const atmRef = doc(db, 'atms', input.atmId);
        const atmDoc = await getDoc(atmRef);

        if (!atmDoc.exists()) {
            console.error(`ATM with ID ${input.atmId} not found.`);
            return { success: false, error: 'ATM not found.' };
        }
        const atmName = atmDoc.data().name;


        // Use a collectionGroup query to find all 'follows' subcollections
        const followsQuery = query(
            collectionGroup(db, 'follows'),
            where('__name__', '>', `users/\0/follows/${input.atmId}`),
            where('__name__', '<', `users/\uffff/follows/${input.atmId}`)
        );

        const followsSnapshot = await getDocs(followsQuery);

        if (followsSnapshot.empty) {
            console.log(`No followers for ATM ${input.atmId}. No notifications sent.`);
            return { success: true };
        }

        const followerIds = followsSnapshot.docs.map(doc => {
            // The user ID is the parent document's ID
            return doc.ref.parent.parent!.id;
        });

        const batch = writeBatch(db);
        const notificationsRef = collection(db, 'notifications');
        const title = `Alerta de Status: ${atmName}`;
        const message = `O ATM foi atualizado para "Com Dinheiro" por ${input.reportingUserName}.`;

        followerIds.forEach(userId => {
            if (!userId) return;
            const newNotificationRef = doc(notificationsRef); // Auto-generate ID
            batch.set(newNotificationRef, {
                userId: userId,
                title: title,
                message: message,
                read: false,
                createdAt: serverTimestamp(),
                type: 'status_update'
            });
        });

        await batch.commit();

        console.log(`Sent ${followerIds.length} notifications for ATM ${input.atmId}.`);
        return { success: true };

    } catch (error) {
        console.error("Error sending notifications to followers:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, error: `Failed to send notifications: ${errorMessage}` };
    }
}
