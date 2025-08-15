import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import dotenv from 'dotenv';
import expand from 'dotenv-expand';

// Carrega as variáveis de ambiente do ficheiro .env
const myEnv = dotenv.config();
expand.expand(myEnv);

export const ai = genkit({
  plugins: [
    googleAI({
        apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
