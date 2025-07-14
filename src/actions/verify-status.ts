"use server";

import { verifyAtmStatus, type VerifyAtmStatusInput, type VerifyAtmStatusOutput } from "@/ai/flows/verify-atm-status";

export async function verifyAtmStatusAction(input: VerifyAtmStatusInput): Promise<VerifyAtmStatusOutput> {
    try {
        const result = await verifyAtmStatus(input);
        return result;
    } catch (error) {
        console.error("Error verifying ATM status with AI:", error);
        throw new Error("AI verification failed.");
    }
}
