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

const needsRewritingTool = ai.defineTool({
  name: 'needsRewriting',
  description: 'Evaluates if the provided text exhibits strong AI-generated characteristics (e.g., robotic tone, excessive formality, repetitive phrasing) and would benefit from rewriting to sound more human.',
  inputSchema: z.object({
    text: z.string().describe('The text to analyze for human-like quality.'),
  }),
  outputSchema: z.boolean().describe('True if the text strongly suggests AI-generation and would benefit from humanization, false if it already sounds natural and human-like or if AI characteristics are not prominent.'),
  async resolve(input) {
    const decisionPrompt = ai.definePrompt({
        name: 'decideRewritingPrompt',
        input: { schema: z.object({ text: z.string() }) },
        output: { schema: z.object({ needsRewrite: z.boolean() }) },
        system: `You are an analytical tool. Your task is to determine if a given piece of text sounds distinctly AI-generated and would significantly benefit from being rewritten to sound more human.
Consider factors like: robotic tone, unnatural phrasing, excessive formality for the context, lack of personality, or overly generic statements.
If the text has strong AI characteristics and rewriting is advisable, output true for 'needsRewrite'.
If the text already sounds reasonably human-like, or if AI characteristics are minimal and rewriting is not strongly indicated, output false.`,
        prompt: `Analyze the following text:
        """{{text}}"""
        Based on your analysis, does this text require rewriting to sound more human?`,
        config: {
            temperature: 0.3,
            safetySettings: [ // Less restrictive for analytical task
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
            ],
        }
    });

    const { output } = await decisionPrompt(input);
    return output?.needsRewrite ?? false; // Default to false if output is unexpectedly null
  },
});

const humanizePrompt = ai.definePrompt({
  name: 'humanizePrompt',
  input: {schema: HumanizeAiContentInputSchema},
  output: {schema: HumanizeAiContentOutputSchema},
  tools: [needsRewritingTool],
  system: `You are an expert writer skilled at transforming AI-generated text into content that sounds natural, engaging, and authentically human.
Your primary instruction is to first use the 'needsRewriting' tool. This tool will tell you if the provided text actually requires humanization.

- If the 'needsRewriting' tool returns 'false' (meaning the text is already human-like or doesn't strongly indicate AI origin), you MUST set 'isRewritten' to false and return the original, unchanged text in the 'humanizedText' field. DO NOT REWRITE IT.
- If the 'needsRewriting' tool returns 'true' (meaning the text shows strong AI characteristics and needs improvement), then you MUST proceed to rewrite the text. Your goal is to eliminate robotic tones, improve flow, inject natural-sounding personality (if appropriate for general content), vary sentence structure, and ensure the language is fluid and engaging. Set 'isRewritten' to true and place your newly humanized text in the 'humanizedText' field.

Focus on making the text sound as if a human wrote it naturally. Avoid simply paraphrasing; aim for a genuine improvement in human-like quality and readability.
`,
  prompt: `Original Text to potentially humanize:
{{{text}}}
`,
  config: { // Standard safety for content generation
    temperature: 0.7,
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
