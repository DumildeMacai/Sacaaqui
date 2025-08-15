import 'dotenv/config';

import { genkit } from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {startDevelopmentFlowServer} from '@genkit-ai/next/dev';

genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    startDevelopmentFlowServer(),
  ],
  logLevel: 'debug',
  model: 'googleai/gemini-2.0-flash',
});
