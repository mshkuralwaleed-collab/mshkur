import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
  textToImageModel: 'googleai/imagen-4.0-fast-generate-001',
  textToVideoModel: 'googleai/veo-2.0-generate-001',
});
