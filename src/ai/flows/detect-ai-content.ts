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
  system: `You are a highly sophisticated AI detection system specialized in identifying AI-generated content with high accuracy. Your task is to analyze text and provide a precise percentage score indicating the likelihood of AI generation.

Key analysis points:
1. Language Patterns:
   - Consistent, repetitive sentence structures
   - Overly formal or mechanical language
   - Perfect grammar and punctuation
   - Generic or templated responses
   - Lack of human errors or typos

2. Content Characteristics:
   - Comprehensive but generic explanations
   - Systematic listing and organization
   - Balanced and neutral tone
   - Lack of personal anecdotes or unique perspectives
   - Excessive use of transition phrases

3. Technical Indicators:
   - Predictable response structures
   - Common AI-generated patterns
   - Standardized formatting
   - Consistent vocabulary usage

Scoring Guidelines:
- 80-100%: Highly likely AI-generated (perfect structure, formal tone, systematic organization)
- 60-80%: Probably AI-generated (shows multiple AI patterns but with some variation)
- 40-60%: Uncertain (mixed signals)
- 20-40%: Likely human-written (shows natural imperfections and personality)
- 0-20%: Very likely human-written (highly personal, unique style)

You MUST respond with a JSON object containing only the aiDetectionScore (0-100).
For AI-generated content, scores should typically range between 75-100.`,
  prompt: `Analyze this text for AI generation patterns and provide your detection score. Be especially critical of formal, structured, and perfectly formatted content:

Text: {{{$input}}}`,
  config: {
    temperature: 0.1, // Lower temperature for more consistent scoring
    responseMimeType: "application/json",
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
      const { output: result } = await detectAiContentPrompt(textInput);

      console.log('[AIGuard - detectAiContentFlow] Prompt result:', JSON.stringify(result, null, 2));

      if (result && typeof result.aiDetectionScore === 'number' && !isNaN(result.aiDetectionScore)) {
        const score = Math.max(0, Math.min(100, Math.round(result.aiDetectionScore)));
        console.log('[AIGuard - detectAiContentFlow] Valid score received:', score);
        return { aiDetectionScore: score };
      }
      
      // Instead of defaulting to 95%, throw an error to be handled properly
      throw new Error('Invalid response format from AI detection');

    } catch (error: any) {
      console.error('[AIGuard - detectAiContentFlow] Error during flow execution or prompt resolution:', error.message || error);
      if (error.stack) {
        console.error(error.stack);
      }
      if (error.details) {
        console.error('[AIGuard - detectAiContentFlow] Error details:', JSON.stringify(error.details, null, 2));
      }
      // Instead of returning 95%, throw the error to be handled by the application
      throw error;
    }
  }
);
