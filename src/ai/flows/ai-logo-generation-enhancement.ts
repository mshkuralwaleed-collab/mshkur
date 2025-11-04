'use server';
/**
 * @fileOverview AI-powered logo generation and enhancement flow.
 *
 * - generateAndEnhanceLogo - Generates an abstract logo and enhances its quality to 8K.
 * - AILogoInput - The input type for the generateAndEnhanceLogo function.
 * - AILogoOutput - The return type for the generateAndEnhanceLogo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AILogoInputSchema = z.object({
  brandName: z.string().describe('The name of the brand for which the logo is being generated.'),
  logoStyle: z
    .string()
    .optional()
    .describe('The desired style or aesthetic of the logo (e.g., minimalist, modern, abstract).'),
  logoColors: z
    .string()
    .optional()
    .describe('The color scheme for the logo (e.g., gold and white, blue and gray).'),
});
export type AILogoInput = z.infer<typeof AILogoInputSchema>;

const AILogoOutputSchema = z.object({
  initialLogo: z
    .string()
    .describe('Base64 encoded data URI of the initially generated logo image.'),
  enhancedLogo: z
    .string()
    .describe('Base64 encoded data URI of the enhanced 8K logo image.'),
  description: z.string().describe('A description of the logo and its design elements.'),
});
export type AILogoOutput = z.infer<typeof AILogoOutputSchema>;

export async function generateAndEnhanceLogo(
  input: AILogoInput
): Promise<AILogoOutput> {
  return aiLogoGenerationAndEnhancementFlow(input);
}

const generateLogoPrompt = ai.definePrompt({
  name: 'generateLogoPrompt',
  input: {schema: AILogoInputSchema},
  output: {schema: z.string().describe('Base64 encoded data URI of the generated logo image.')},
  prompt: `You are an AI logo generation expert. Generate an abstract logo for the brand "{{{brandName}}}". The logo should be in the style of "{{{logoStyle}}}" and use the colors "{{{logoColors}}}". Return the logo as a base64 encoded data URI.`,
});

const enhanceLogoPrompt = ai.definePrompt({
  name: 'enhanceLogoPrompt',
  input: {schema: z.string().describe('Base64 encoded data URI of the logo image.')},
  output: {
    schema: z
      .object({
        enhancedLogo: z
          .string()
          .describe('Base64 encoded data URI of the enhanced 8K logo image.'),
        description: z
          .string()
          .describe('A description of the logo and its design elements.'),
      })
      .passthrough(),
  },
  prompt: `You are an AI image enhancement expert. Enhance the quality of the given logo image ({{{media url=initialLogo}}}) to 8K resolution. Provide a description of the logo and its design elements. Return the enhanced logo as a base64 encoded data URI and the description. The response MUST be a JSON object with "enhancedLogo" and "description" fields.`,
});

const aiLogoGenerationAndEnhancementFlow = ai.defineFlow(
  {
    name: 'aiLogoGenerationAndEnhancementFlow',
    inputSchema: AILogoInputSchema,
    outputSchema: AILogoOutputSchema,
  },
  async input => {
    const initialLogoResult = await generateLogoPrompt(input);
    const initialLogo = initialLogoResult.output!;

    const enhanceLogoResult = await enhanceLogoPrompt({
      initialLogo,
    });
    const {enhancedLogo, description} = enhanceLogoResult.output!;

    return {
      initialLogo,
      enhancedLogo: enhancedLogo!,
      description: description!,
    };
  }
);
