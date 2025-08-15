'use server';
import 'dotenv/config';

import { genkit } from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  model: 'googleai/gemini-2.0-flash',
});
