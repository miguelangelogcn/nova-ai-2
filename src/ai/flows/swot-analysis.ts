// SWOT analysis file
'use server';
/**
 * @fileOverview Generates a SWOT analysis based on questionnaire responses.
 *
 * - generateSwotAnalysis - A function that generates the SWOT analysis.
 * - GenerateSwotAnalysisInput - The input type for the generateSwotAnalysis function.
 * - GenerateSwotAnalysisOutput - The return type for the generateSwotAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSwotAnalysisInputSchema = z.object({
  questionnaireResponses: z
    .string()
    .describe('The responses from the questionnaire.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

const GenerateSwotAnalysisOutputSchema = z.object({
  strengths: z.string().describe('The strengths of the individual.'),
  weaknesses: z.string().describe('The weaknesses of the individual.'),
  opportunities: z.string().describe('The opportunities for the individual.'),
  threats: z.string().describe('The threats to the individual.'),
});
export type GenerateSwotAnalysisOutput = z.infer<typeof GenerateSwotAnalysisOutputSchema>;

export async function generateSwotAnalysis(input: GenerateSwotAnalysisInput): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: {schema: GenerateSwotAnalysisInputSchema},
  output: {schema: GenerateSwotAnalysisOutputSchema},
  prompt: `Analyze the following questionnaire responses and generate a SWOT analysis.

Questionnaire Responses: {{{questionnaireResponses}}}

Strengths: A list of strengths.
Weaknesses: A list of weaknesses.
Opportunities: A list of opportunities.
Threats: A list of threats.`,
});

const generateSwotAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSwotAnalysisFlow',
    inputSchema: GenerateSwotAnalysisInputSchema,
    outputSchema: GenerateSwotAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
