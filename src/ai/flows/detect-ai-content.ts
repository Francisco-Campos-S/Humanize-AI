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
    temperature: 0.1, 
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
      // Call the prompt. 'result' should conform to DetectAiContentOutputSchema
      // because detectAiContentPrompt is defined with output: {schema: DetectAiContentOutputSchema}
      // and responseMimeType: "application/json" which should enforce this.
      const result: DetectAiContentOutput | undefined = await detectAiContentPrompt(textInput);

      console.log('[AIGuard - detectAiContentFlow] Prompt result (expected DetectAiContentOutput):', JSON.stringify(result, null, 2));

      if (result && typeof result.aiDetectionScore === 'number' && !isNaN(result.aiDetectionScore)) {
        const score = Math.max(0, Math.min(100, Math.round(result.aiDetectionScore)));
        console.log('[AIGuard - detectAiContentFlow] Score from direct number output:', score);
        return { aiDetectionScore: score };
      }
      
      // Fallback: if result.aiDetectionScore is a string (e.g., "75") that needs parsing
      if (result && typeof (result as any).aiDetectionScore === 'string') {
        const parsedScore = parseFloat((result as any).aiDetectionScore as string);
        if (!isNaN(parsedScore)) {
          const score = Math.max(0, Math.min(100, Math.round(parsedScore)));
          console.log('[AIGuard - detectAiContentFlow] Score parsed from string value in output:', score);
          return { aiDetectionScore: score };
        }
      }

      // If we reach here, the 'result' object from the prompt did not contain a usable aiDetectionScore.
      // This implies a deeper issue with the LLM's response or Genkit's JSON parsing/validation.
      console.error(
        '[AIGuard - detectAiContentFlow] AI detection prompt returned invalid or unusable score. Full result:',
        JSON.stringify(result, null, 2)
      );
      // Defaulting to 5% as a noticeable "problem" score.
      return { aiDetectionScore: 5 };

    } catch (error: any) {
      // This catch block will handle errors from the prompt call itself (e.g., network issues, API errors)
      // or if the prompt's response could not be coerced into DetectAiContentOutputSchema by Genkit
      // (which might happen if the LLM returns malformed JSON or non-JSON text despite responseMimeType).
      console.error('[AIGuard - detectAiContentFlow] Error during flow execution or prompt resolution:', error.message || error);
      if (error.stack) {
        console.error(error.stack);
      }
      // Log details if available (Genkit specific error structure might vary)
      if (error.details) {
        console.error('[AIGuard - detectAiContentFlow] Error details:', JSON.stringify(error.details, null, 2));
      }
      // If the error object has a 'response' property (e.g. from an underlying HTTP client)
      // it might contain the raw text from the LLM.
      // This part is speculative as actual error structure can vary.
      // if (error.response && typeof error.response.text === 'function') {
      //   try {
      //     const errorResponseText = await error.response.text();
      //     console.error('[AIGuard - detectAiContentFlow] Raw error response text:', errorResponseText);
      //   } catch (textError) {
      //     console.error('[AIGuard - detectAiContentFlow] Could not get raw error response text:', textError);
      //   }
      // }


      return { aiDetectionScore: 5 }; // Defaulting to 5% on error
    }
  }
);
