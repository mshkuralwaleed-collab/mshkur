'use server';
/**
 * @fileOverview Generates a dynamic 3D video background based on a text prompt.
 *
 * - generate3DBackground - A function that generates a 3D video background.
 * - Generate3DBackgroundInput - The input type for the generate3DBackground function.
 * - Generate3DBackgroundOutput - The return type for the generate3DBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const Generate3DBackgroundInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A detailed description of the desired 3D video background aesthetic.'
    ),
});
export type Generate3DBackgroundInput = z.infer<
  typeof Generate3DBackgroundInputSchema
>;

const Generate3DBackgroundOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      'The generated 3D video background as a data URI (video/mp4) that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type Generate3DBackgroundOutput = z.infer<
  typeof Generate3DBackgroundOutputSchema
>;

export async function generate3DBackground(
  input: Generate3DBackgroundInput
): Promise<Generate3DBackgroundOutput> {
  return generate3DBackgroundFlow(input);
}

const generate3DBackgroundPrompt = ai.definePrompt({
  name: 'generate3DBackgroundPrompt',
  input: {schema: Generate3DBackgroundInputSchema},
  output: {schema: Generate3DBackgroundOutputSchema},
  prompt: `You are an expert in generating prompts for 3D video generation.
  Based on the user's description, generate a detailed and creative prompt suitable for a 3D video generation model.
  User Description: {{{prompt}}}`,
});

const generate3DBackgroundFlow = ai.defineFlow(
  {
    name: 'generate3DBackgroundFlow',
    inputSchema: Generate3DBackgroundInputSchema,
    outputSchema: Generate3DBackgroundOutputSchema,
  },
  async input => {
    // First, generate a refined prompt using the prompt generator.
    const {output: refinedPromptOutput} = await generate3DBackgroundPrompt(input);
    const refinedPrompt = refinedPromptOutput?.videoDataUri;

    if (!refinedPrompt) {
      throw new Error('Failed to generate a refined prompt.');
    }

    // Generate the video using the Veo model.
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: refinedPrompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time, maybe even up to a minute. Design the UI accordingly.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    //console.log(`Video URL: ${video.media!.url}`);

    return {videoDataUri: video.media!.url};
  }
);
