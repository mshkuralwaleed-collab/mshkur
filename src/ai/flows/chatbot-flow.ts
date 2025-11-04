'use server';

/**
 * @fileOverview An AI chatbot that can answer questions based on digital card data.
 *
 * - chatbot - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatbotInputSchema = z.object({
  cardData: z
    .string()
    .describe('A JSON string representing the digital business card data.'),
  query: z.string().describe("The user's question to the chatbot."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe("The chatbot's answer."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: { schema: ChatbotInputSchema },
  output: { schema: ChatbotOutputSchema },
  prompt: `You are a helpful AI assistant for the person described in the following digital business card data. Your goal is to answer questions about this person based ONLY on the information provided. Be friendly and professional. If you don't know the answer from the data, say that you don't have that information.

Card Data:
{{{cardData}}}

User's Question:
"{{{query}}}"
`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
