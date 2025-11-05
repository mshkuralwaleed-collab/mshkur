
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
  prompt: `You are an expert logo designer. Create a visually appealing and abstract logo for a brand named "{{{brandName}}}".

The desired style is "{{{logoStyle}}}" and the color scheme should be "{{{logoColors}}}".

The logo should be on a transparent background. Return the final logo as a base64 encoded data URI.`,
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
          .describe('A detailed description of the logo, its symbolism, and design elements.'),
      })
      .passthrough(),
  },
  prompt: `You are a world-class AI image enhancement specialist and art director. You will be given a logo image. Your task is to perform two actions:

1.  **Enhance:** Upscale the provided logo image ({{{media url=initialLogo}}}) to the highest possible quality (8K resolution). The final image must have a transparent background.
2.  **Describe:** Write a brief, compelling description of the logo's design, symbolism, and aesthetic.

Return a valid JSON object containing two fields:
- "enhancedLogo": The base64 encoded data URI of the final, enhanced logo image.
- "description": The detailed description of the logo.
`,
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
