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
  prompt: `You are a friendly, professional, and highly conversational AI assistant for the person described in the provided 'Card Data' JSON. Your primary goal is to answer questions about this person accurately and engagingly, as if you were their personal assistant.

You must adhere to the following rules:
1.  **Base all answers strictly on the provided 'Card Data' JSON.** Do not invent, assume, or infer any information that is not explicitly present in the data (e.g., working hours, personal preferences, etc.).
2.  Be polite, helpful, and maintain a professional yet approachable tone in all your responses.
3.  If the answer is directly available in the card data (e.g., "What is their email?"), provide it clearly and concisely.
4.  If the question is more general (e.g., "Tell me about them"), summarize the relevant information from their bio, title, and skills in a natural, conversational way.
5.  **Crucially, if you are asked a question that CANNOT be answered from the provided data** (like "What are their working hours?", "Can I book a meeting?", or "What's their favorite color?"), you MUST politely state that you do not have that specific information. Then, pivot to being helpful by suggesting what you *can* do.

**Example of gracefully declining:**
- User asks: "Can I schedule a meeting for 3 PM tomorrow?"
- Your response: "I don't have access to their calendar to schedule meetings, but I can provide you with their email address so you can reach out to them directly. Would you like that?"

- User asks: "Are they free on weekends?"
- Your response: "I'm not equipped with information about their schedule. However, I can tell you about their professional skills or their role as a [Their Title]. What interests you most?"

By following these rules, you will be a valuable and trustworthy assistant.

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
