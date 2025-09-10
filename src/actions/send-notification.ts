
'use server';

import { db } from "@/firebase/init";
import { doc, getDoc, collection, addDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import type { Atm } from "@/types";

interface SendNotificationInput {
    atmId: string;
    atmName: string;
    reportingUserName: string;
}

/**
 * Sends a notification to all users following a specific ATM.
 */
export async function sendNotificationToFollowers(input: SendNotificationInput): Promise<{ success: boolean, error?: string }> {
    try {
        const atmRef = doc(db, 'atms', input.atmId);
        const atmDoc = await getDoc(atmRef);

        if (!atmDoc.exists()) {
            console.error(`ATM with ID ${input.atmId} not found.`);
            return { success: false, error: 'ATM not found.' };
        }

        const atmData = atmDoc.data() as Atm;
        const followers = atmData.followers;

        if (!followers || followers.length === 0) {
            console.log(`No followers for ATM ${input.atmId}. No notifications sent.`);
            return { success: true }; // Not an error, just no one to notify
        }

        const batch = writeBatch(db);
        const notificationsRef = collection(db, 'notifications');
        const title = `Alerta de Status: ${input.atmName}`;
        const message = `O ATM foi atualizado para "Com Dinheiro" por ${input.reportingUserName}.`;

        followers.forEach(userId => {
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

        console.log(`Sent ${followers.length} notifications for ATM ${input.atmId}.`);
        return { success: true };

    } catch (error) {
        console.error("Error sending notifications to followers:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, error: `Failed to send notifications: ${errorMessage}` };
    }
}
