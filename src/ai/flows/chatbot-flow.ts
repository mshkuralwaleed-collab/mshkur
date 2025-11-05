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
  prompt: `You are a friendly and professional AI assistant for the person described in the provided digital business card data. Your primary goal is to answer questions about this person accurately and concisely, based *only* on the information given in the 'Card Data' JSON.

- Be conversational and helpful.
- If the answer to a question is directly available in the card data (e.g., "What is their email?"), provide the answer directly.
- If the question is more general (e.g., "Tell me about their skills"), summarize the relevant information.
- If the user asks a question that cannot be answered from the provided data, you MUST politely state that you don't have that specific information. Do not invent answers. For example, say: "I don't have that information, but I can tell you about their skills if you'd like."

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
