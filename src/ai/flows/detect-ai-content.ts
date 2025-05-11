'use server';

/**
 * @fileOverview This file contains the Genkit flow for detecting if a given text is AI-generated.
 *
 * It exports:
 * - `detectAiContent`: An async function to analyze text and return the likelihood of it being AI-generated.
 * - `DetectAiContentInput`: The input type for the detectAiContent function, which is a string.
 * - `DetectAiContentOutput`: The output type, which includes the AI detection score as a percentage.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const DetectAiContentInputSchema = z
  .string()
  .describe('The text to analyze for AI generation.');
export type DetectAiContentInput = z.infer<typeof DetectAiContentInputSchema>;

const DetectAiContentOutputSchema = z.object({
  aiDetectionScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'The percentage likelihood (0-100) of the text being AI-generated. 0 means certainly human, 100 means certainly AI.'
    ),
});
export type DetectAiContentOutput = z.infer<typeof DetectAiContentOutputSchema>;

export async function detectAiContent(
  input: DetectAiContentInput
): Promise<DetectAiContentOutput> {
  return detectAiContentFlow(input);
}

const detectAiContentPrompt = ai.definePrompt({
  name: 'detectAiContentPrompt',
  input: {schema: DetectAiContentInputSchema},
  output: {schema: DetectAiContentOutputSchema},
  system: `You are a highly sophisticated AI detection system. Your sole purpose is to analyze text and identify signatures of AI generation.
Be extremely critical and look for patterns such as:
- Overly formal, neutral, or robotic language
- Repetitive sentence structures or phrasing
- Generic, bland, or predictable statements
- Lack of nuanced opinions, personal voice, or specific examples
- Unnatural flow, awkward transitions, or overly simplistic connections
- Perfect grammar and spelling without common human imperfections (unless specifically designed to mimic them)
- Use of common AI "filler" phrases or overly verbose explanations for simple concepts.

You MUST respond with a JSON object. The JSON object must conform to the following Zod schema:
{
  "aiDetectionScore": "number (0-100, percentage likelihood of AI generation. 0 means certainly human, 100 means certainly AI)"
}
Provide only the JSON object. Do not add any explanatory text before or after the JSON.
Even for short texts, provide your best assessment.
`,
  prompt: `Analyze the following text for AI generation signatures and provide your detection score as a JSON object according to the specified schema:

Text: {{{$input}}}`,
  config: {
    temperature: 0.1, // Lower temperature for more deterministic JSON output
    responseMimeType: "application/json", // Request JSON output
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  }
});

const detectAiContentFlow = ai.defineFlow(
  {
    name: 'detectAiContentFlow',
    inputSchema: DetectAiContentInputSchema,
    outputSchema: DetectAiContentOutputSchema,
  },
  async (textInput: DetectAiContentInput): Promise<DetectAiContentOutput> => {
    try {
      const { output } = await detectAiContentPrompt(textInput);

      if (output && typeof output.aiDetectionScore === 'number' && !isNaN(output.aiDetectionScore)) {
        const score = Math.max(0, Math.min(100, Math.round(output.aiDetectionScore)));
        return { aiDetectionScore: score };
      } else {
        console.error(
          '[AIGuard - detectAiContentFlow] AI detection prompt returned invalid or missing score. Raw output:',
          JSON.stringify(output) 
        );
        return { aiDetectionScore: 0 }; 
      }
    } catch (error) {
      console.error('[AIGuard - detectAiContentFlow] Error during flow execution:', error);
      return { aiDetectionScore: 0 }; 
    }
  }
);
