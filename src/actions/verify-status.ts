"use server";

import { verifyAtmStatus, type VerifyAtmStatusInput, type VerifyAtmStatusOutput } from "@/ai/flows/verify-atm-status";

export async function verifyAtmStatusAction(input: VerifyAtmStatusInput): Promise<VerifyAtmStatusOutput> {
    try {
        const result = await verifyAtmStatus(input);
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Error verifying ATM status with AI:", errorMessage);
        console.error("Full error object:", error);
        throw new Error(`AI verification failed: ${errorMessage}`);
    }
}
