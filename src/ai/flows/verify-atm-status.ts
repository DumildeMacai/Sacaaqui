'use server';

/**
 * @fileOverview This file implements an AI flow to verify the ATM status based on user reports and reputation.
 *
 * - verifyAtmStatus - A function that verifies the ATM status.
 * - VerifyAtmStatusInput - The input type for the verifyAtmStatus function.
 * - VerifyAtmStatusOutput - The output type for the verifyAtmStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyAtmStatusInputSchema = z.object({
  atmId: z.string().describe('The ID of the ATM to verify.'),
  reports: z.array(
    z.object({
      userId: z.string().describe('The ID of the user reporting the status.'),
      status: z.enum(['com_dinheiro', 'sem_dinheiro']).describe('The reported status of the ATM.'),
      timestamp: z.string().describe('The timestamp of the report in ISO format.'),
      userReputation: z.number().int().describe("The reputation score of the user who made the report."),
    })
  ).describe('An array of user reports for the ATM status, including user reputation.'),
});
export type VerifyAtmStatusInput = z.infer<typeof VerifyAtmStatusInputSchema>;

const VerifyAtmStatusOutputSchema = z.object({
  verifiedStatus: z.enum(['com_dinheiro', 'sem_dinheiro', 'desconhecido']).describe('The AI-verified status of the ATM.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0 to 1) for the verified status.'),
  reasoning: z.string().describe('The reasoning behind the AI verification.'),
});
export type VerifyAtmStatusOutput = z.infer<typeof VerifyAtmStatusOutputSchema>;

export async function verifyAtmStatus(input: VerifyAtmStatusInput): Promise<VerifyAtmStatusOutput> {
  return verifyAtmStatusFlow(input);
}

const verifyAtmStatusPrompt = ai.definePrompt({
  name: 'verifyAtmStatusPrompt',
  input: {schema: VerifyAtmStatusInputSchema},
  output: {schema: VerifyAtmStatusOutputSchema},
  prompt: `You are an AI assistant tasked with verifying the status of ATMs based on user reports.

  You must analyze the provided reports to determine the most likely current status of the ATM.
  Your analysis should be weighted by two key factors:
  1.  **User Reputation**: Reports from users with higher reputation scores are more trustworthy.
  2.  **Recency**: More recent reports are more likely to reflect the current state of the ATM.

  Given the following ATM ID: {{{atmId}}}
  And the following user reports:
  {{#each reports}}
  - User ID: {{{userId}}}, Status: {{{status}}}, Timestamp: {{{timestamp}}}, Reputation: {{{userReputation}}}
  {{/each}}

  Based on your weighted analysis, determine the most likely status of the ATM (com_dinheiro, sem_dinheiro, or desconhecido). Provide a confidence score (from 0 to 1) and a brief reasoning for your decision, explaining how reputation and recency influenced the outcome.

  Output in JSON format.`,
});

const verifyAtmStatusFlow = ai.defineFlow(
  {
    name: 'verifyAtmStatusFlow',
    inputSchema: VerifyAtmStatusInputSchema,
    outputSchema: VerifyAtmStatusOutputSchema,
  },
  async input => {
    const {output} = await verifyAtmStatusPrompt(input);
    return output!;
  }
);
