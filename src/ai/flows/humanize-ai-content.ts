'use server';

/**
 * @fileOverview Rewrites AI-generated content to be more human-like.
 *
 * - humanizeAiContent - A function that accepts AI-generated text and returns a more human-like version.
 * - HumanizeAiContentInput - The input type for the humanizeAiContent function.
 * - HumanizeAiContentOutput - The return type for the humanizeAiContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const needsRewritingTool = ai.defineTool({
  name: 'needsRewriting',
  description: 'Determine if the provided text needs rewriting to sound more human.',
  inputSchema: z.object({
    text: z.string().describe('The text to analyze.'),
  }),
  outputSchema: z.boolean().describe('True if the text needs rewriting, false otherwise.'),
  async resolve(input) {
    // Basic implementation - always returns true.  A real implementation would use an LLM or other logic.
    return true;
  },
});

const humanizePrompt = ai.definePrompt({
  name: 'humanizePrompt',
  input: {schema: HumanizeAiContentInputSchema},
  output: {schema: HumanizeAiContentOutputSchema},
  tools: [needsRewritingTool],
  prompt: `You are an AI assistant that rewrites text to sound more human-like.  If the needsRewriting tool indicates that rewriting is not needed, simply return the original text in the humanizedText field and set isRewritten to false. Otherwise rewrite the text to sound more natural and human-like, and set isRewritten to true.

Original Text: {{{text}}}`,
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
