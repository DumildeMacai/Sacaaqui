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
  prompt: `You are an AI assistant for an ATM locator app. Your task is to determine the most likely status of an ATM based on a series of user reports.

  You must weigh the reports based on two main factors:
  1.  **Recency**: Newer reports are more valuable than older ones. A report from 5 minutes ago is more significant than one from 2 days ago.
  2.  **User Reputation**: Reports from users with a higher reputation score are more trustworthy. A user with a reputation of 10 is more reliable than a user with a reputation of 1.

  Analyze the following reports for ATM ID {{{atmId}}}:
  {{#each reports}}
  - Report: Status="{{{status}}}", Timestamp="{{{timestamp}}}", UserReputation={{userReputation}}
  {{/each}}

  Based on a weighted analysis of recency and reputation, decide the most probable status: 'com_dinheiro', 'sem_dinheiro', or 'desconhecido' if there isn't enough information or the data is too conflicting.

  Provide your final decision in JSON format with a confidence score (0.0 to 1.0) and a brief reasoning for your conclusion.
  
  Example reasoning: "The most recent reports, including one from a high-reputation user, indicate the ATM has cash. Conflicting older reports were given less weight."
  
  `,
});

const verifyAtmStatusFlow = ai.defineFlow(
  {
    name: 'verifyAtmStatusFlow',
    inputSchema: VerifyAtmStatusInputSchema,
    outputSchema: VerifyAtmStatusOutputSchema,
  },
  async input => {
    const {output} = await verifyAtmStatusPrompt(input);
    if (!output) {
        throw new Error('The AI model failed to produce a valid output.');
    }
    return output;
  }
);
