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
      "The generated 3D video background as a data URI (video/mp4) that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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

const generate3DBackgroundFlow = ai.defineFlow(
  {
    name: 'generate3DBackgroundFlow',
    inputSchema: Generate3DBackgroundInputSchema,
    outputSchema: Generate3DBackgroundOutputSchema,
  },
  async input => {
    // Generate the video using the Veo model.
    let {operation} = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: input.prompt,
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

    return {videoDataUri: video.media!.url};
  }
);
