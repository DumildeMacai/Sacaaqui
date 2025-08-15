'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// IMPORTANT: The API key is hardcoded here to resolve persistent environment variable loading issues.
// This is suitable for development but it is recommended to use a more secure method for production,
// such as environment variables managed by your hosting provider.
const GEMINI_API_KEY = "AIzaSyBM_jbi-wFTiQWcjU6kbEqY-sbBVYHbJRw";

export const ai = genkit({
  plugins: [
    googleAI({
        apiKey: GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
