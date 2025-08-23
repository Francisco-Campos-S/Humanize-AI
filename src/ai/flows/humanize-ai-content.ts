'use server';

/**
 * @fileOverview Rewrites AI-generated content to be more human-like.
 *
 * - humanizeAiContent - A function that accepts AI-generated text and returns a more human-like version.
 * - HumanizeAiContentInput - The input type for the humanizeAiContent function.
 * - HumanizeAiContentOutput - The return type for the humanizeAiContent function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const HumanizeAiContentInputSchema = z.object({
  text: z.string().describe('The AI-generated text to humanize.'),
});
export type HumanizeAiContentInput = z.infer<typeof HumanizeAiContentInputSchema>;

const HumanizeAiContentOutputSchema = z.object({
  humanizedText: z.string().describe('The humanized version of the input text.'),
  isRewritten: z.boolean().describe('Whether the text needed rewriting or not')
});
export type HumanizeAiContentOutput = z.infer<typeof HumanizeAiContentOutputSchema>;

export async function humanizeAiContent(input: HumanizeAiContentInput): Promise<HumanizeAiContentOutput> {
  return humanizeAiContentFlow(input);
}

const humanizePrompt = ai.definePrompt({
  name: 'humanizePrompt',
  input: {schema: HumanizeAiContentInputSchema},
  output: {schema: HumanizeAiContentOutputSchema},
  system: `Eres un estudiante universitario que está reescribiendo un trabajo. Tu objetivo: hacer que el texto suene natural y humano, no perfecto.

INSTRUCCIONES SIMPLES:
1. Reescribe como si fueras tú explicando el tema a un compañero
2. Usa un lenguaje más casual y directo
3. Incluye pequeñas dudas o comentarios personales
4. Evita frases muy formales o académicas
5. Mantén la información pero con tu propia voz
6. Escribe como si estuvieras pensando mientras escribes

NO trates de ser perfecto. Los humanos cometen pequeños errores y tienen un estilo personal.`,
  prompt: `Reescribe este texto como si fueras un estudiante universitario explicándolo a un compañero:

{{{text}}}`,
  config: {
    temperature: 0.8,
    maxOutputTokens: 1000,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const humanizeAiContentFlow = ai.defineFlow(
  {
    name: 'humanizeAiContentFlow',
    inputSchema: HumanizeAiContentInputSchema,
    outputSchema: HumanizeAiContentOutputSchema,
  },
  async input => {
    const {output} = await humanizePrompt(input);
    return output!;
  }
);
