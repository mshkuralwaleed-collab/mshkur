'use server';

/**
 * @fileOverview A flow for extracting data from an image using OCR and generating a professional bio.
 *
 * - dataExtractionAndBioGeneration - A function that handles the data extraction and bio generation process.
 * - DataExtractionAndBioGenerationInput - The input type for the dataExtractionAndBioGeneration function.
 * - DataExtractionAndBioGenerationOutput - The return type for the dataExtractionAndBioGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataExtractionAndBioGenerationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a business card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DataExtractionAndBioGenerationInput = z.infer<typeof DataExtractionAndBioGenerationInputSchema>;

const DataExtractionAndBioGenerationOutputSchema = z.object({
  extractedData: z.string().describe('The extracted data from the image.'),
  bio: z.string().describe('A professional bio generated based on the extracted data.'),
});
export type DataExtractionAndBioGenerationOutput = z.infer<typeof DataExtractionAndBioGenerationOutputSchema>;

export async function dataExtractionAndBioGeneration(input: DataExtractionAndBioGenerationInput): Promise<DataExtractionAndBioGenerationOutput> {
  return dataExtractionAndBioGenerationFlow(input);
}

const ocrPrompt = ai.definePrompt({
  name: 'ocrPrompt',
  input: {schema: DataExtractionAndBioGenerationInputSchema},
  output: {schema: z.object({extractedData: z.string()})},
  prompt: `You are an OCR expert. Extract all text from the following image of a business card: {{media url=photoDataUri}}.\n\nExtracted Text:`,
});

const bioPrompt = ai.definePrompt({
  name: 'bioPrompt',
  input: {schema: z.object({extractedData: z.string()})},
  output: {schema: z.object({bio: z.string()})},
  prompt: `You are a professional bio writer. Based on the following extracted data from a business card, write a professional bio.  Be formal and concise.\n\nExtracted Data: {{{extractedData}}} \n\nProfessional Bio:`,
});

const dataExtractionAndBioGenerationFlow = ai.defineFlow(
  {
    name: 'dataExtractionAndBioGenerationFlow',
    inputSchema: DataExtractionAndBioGenerationInputSchema,
    outputSchema: DataExtractionAndBioGenerationOutputSchema,
  },
  async input => {
    const ocrResult = await ocrPrompt(input);
    const extractedData = ocrResult.output?.extractedData;

    if (!extractedData) {
      throw new Error('Could not extract data from the image.');
    }

    const bioResult = await bioPrompt({extractedData});
    const bio = bioResult.output?.bio;

    if (!bio) {
      throw new Error('Could not generate bio.');
    }

    return {
      extractedData,
      bio,
    };
  }
);
