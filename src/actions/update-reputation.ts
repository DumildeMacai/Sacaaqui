'use server';

import { updateUserReputation, type UpdateUserReputationInput, type UpdateUserReputationOutput } from "@/ai/flows/update-user-reputation";
import { db } from "@/firebase/init";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export async function updateUserReputationAction(input: UpdateUserReputationInput): Promise<void> {
    try {
        console.log("Starting reputation update action with input:", input);

        // 1. Get reputation adjustments from the AI
        const aiResult = await updateUserReputation(input);
        console.log("AI result for reputation updates:", aiResult);

        if (!aiResult || !aiResult.reputationUpdates || aiResult.reputationUpdates.length === 0) {
            console.log("No reputation updates suggested by AI.");
            return;
        }

        // 2. Apply updates to Firestore in a batch or loop
        const updatePromises = aiResult.reputationUpdates.map(async (update) => {
            if (!update.userId || typeof update.reputationChange !== 'number') {
                console.warn("Skipping invalid reputation update:", update);
                return;
            }

            const userRef = doc(db, 'users', update.userId);
            
            // Check if user exists before attempting to update
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                console.warn(`User with ID ${update.userId} not found. Skipping reputation update.`);
                return;
            }

            console.log(`Updating reputation for user ${update.userId} by ${update.reputationChange}`);
            
            // Use Firestore's `increment` to safely update the score
            return updateDoc(userRef, {
                reputation: increment(update.reputationChange)
            });
        });

        await Promise.all(updatePromises);
        console.log("All reputation updates have been processed.");

    } catch (error) {
        console.error("Error in updateUserReputationAction:", error);
        // We don't throw an error to the client, as this is a background process.
        // Errors are logged on the server.
    }
}
