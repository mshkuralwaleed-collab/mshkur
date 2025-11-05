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
  prompt: `You are a friendly and professional AI assistant for the person described in the provided digital business card data. Your primary goal is to answer questions about this person accurately and concisely.

You must adhere to the following rules:
1.  **Base all answers on the provided 'Card Data' JSON.** Do not invent information.
2.  Be conversational, helpful, and polite.
3.  If the answer is directly in the card data (e.g., "What is their email?"), provide it clearly.
4.  If the question is general (e.g., "Tell me about their skills"), summarize the relevant information.
5.  If the user asks a question that CANNOT be answered from the provided data (e.g., "What are their working hours?" or "Can I book a meeting?"), you MUST politely state that you don't have that information and suggest what you *can* help with. For example: "I don't have access to their schedule, but I can tell you about their skills or provide their contact information."

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
