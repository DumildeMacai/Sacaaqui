'use server';

/**
 * @fileOverview This file implements an AI flow to update user reputation based on the accuracy of their ATM status reports.
 *
 * - updateUserReputation - A function that adjusts user reputation scores.
 * - UpdateUserReputationInput - The input type for the updateUserReputation function.
 * - UpdateUserReputationOutput - The output type for the updateUserReputation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateUserReputationInputSchema = z.object({
  verifiedStatus: z.enum(['com_dinheiro', 'sem_dinheiro']).describe('The verified, true status of the ATM.'),
  reports: z.array(
    z.object({
      userId: z.string().describe('The ID of the user who made the report.'),
      status: z.enum(['com_dinheiro', 'sem_dinheiro']).describe('The status reported by the user.'),
    })
  ).describe('A list of user reports to be evaluated.'),
});
export type UpdateUserReputationInput = z.infer<typeof UpdateUserReputationInputSchema>;

const UpdateUserReputationOutputSchema = z.object({
  reputationUpdates: z.array(
    z.object({
      userId: z.string().describe('The ID of the user whose reputation is being updated.'),
      reputationChange: z.number().int().describe('The change in reputation score. Typically +1 for a correct report and -1 for an incorrect one.'),
      reasoning: z.string().describe('A brief explanation for the reputation change.'),
    })
  ).describe('An array of reputation updates for the users.'),
});
export type UpdateUserReputationOutput = z.infer<typeof UpdateUserReputationOutputSchema>;


export async function updateUserReputation(input: UpdateUserReputationInput): Promise<UpdateUserReputationOutput> {
    return updateUserReputationFlow(input);
}


const updateUserReputationPrompt = ai.definePrompt({
    name: 'updateUserReputationPrompt',
    input: {schema: UpdateUserReputationInputSchema},
    output: {schema: UpdateUserReputationOutputSchema},
    prompt: `You are an AI assistant that manages user reputations in an ATM locator app.
  
    Your task is to adjust user reputation scores based on the accuracy of their reports.
  
    The verified, true status of the ATM is: {{{verifiedStatus}}}
  
    Here are the user reports you need to evaluate:
    {{#each reports}}
    - User ID: {{{userId}}}, Reported Status: {{{status}}}
    {{/each}}
  
    For each report, compare the user's reported status with the verified status.
    - If the reported status matches the verified status, their reputation should increase by 1.
    - If the reported status does not match, their reputation should decrease by 1.
  
    Provide a list of all necessary reputation updates in JSON format.
    `,
  });

const updateUserReputationFlow = ai.defineFlow(
  {
    name: 'updateUserReputationFlow',
    inputSchema: UpdateUserReputationInputSchema,
    outputSchema: UpdateUserReputationOutputSchema,
  },
  async input => {
    const {output} = await updateUserReputationPrompt(input);
    return output!;
  }
);
