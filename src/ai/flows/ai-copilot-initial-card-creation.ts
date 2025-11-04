'use server';

/**
 * @fileOverview An AI copilot for initial digital card creation.
 *
 * - aiCopilotInitialCardCreation - A function that handles the initial digital card creation process.
 * - AICopilotInitialCardCreationInput - The input type for the aiCopilotInitialCardCreation function.
 * - AICopilotInitialCardCreationOutput - The return type for the aiCopilotInitialCardCreation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICopilotInitialCardCreationInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired digital business card.'),
});
export type AICopilotInitialCardCreationInput = z.infer<typeof AICopilotInitialCardCreationInputSchema>;

const AICopilotInitialCardCreationOutputSchema = z.object({
  cardData: z.string().describe('JSON containing the digital business card data, including name, title, contact information, bio, and skills.'),
});
export type AICopilotInitialCardCreationOutput = z.infer<typeof AICopilotInitialCardCreationOutputSchema>;

export async function aiCopilotInitialCardCreation(input: AICopilotInitialCardCreationInput): Promise<AICopilotInitialCardCreationOutput> {
  return aiCopilotInitialCardCreationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCopilotInitialCardCreationPrompt',
  input: {schema: AICopilotInitialCardCreationInputSchema},
  output: {schema: AICopilotInitialCardCreationOutputSchema},
  prompt: `You are an AI copilot specializing in creating professional digital business cards. Based on the user's prompt, generate a JSON object containing the digital business card data, including name, title, contact information, a professional bio, and a list of relevant skills.

User Prompt: {{{prompt}}}

Ensure the output is a valid JSON string.
`,
});

const aiCopilotInitialCardCreationFlow = ai.defineFlow(
  {
    name: 'aiCopilotInitialCardCreationFlow',
    inputSchema: AICopilotInitialCardCreationInputSchema,
    outputSchema: AICopilotInitialCardCreationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
