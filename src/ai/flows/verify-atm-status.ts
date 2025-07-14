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
    })
  ).describe('An array of user reports for the ATM status.'),
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

  Given the following ATM ID: {{{atmId}}}
  And the following user reports:
  {{#each reports}}
  - User ID: {{{userId}}}, Status: {{{status}}}, Timestamp: {{{timestamp}}}
  {{/each}}

  Analyze the reports, taking into account potential biases, user reputation (which is not provided but should be assumed), and the recency of the reports.

  Determine the most likely status of the ATM (com_dinheiro, sem_dinheiro, or desconhecido) and provide a confidence score (0 to 1) for your assessment.

  Also, provide a brief reasoning for your decision.

  Output in JSON format:
  { "verifiedStatus": "<status>", "confidenceScore": <score>, "reasoning": "<reason>" }`,
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
