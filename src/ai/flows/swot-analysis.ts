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
    .describe('As respostas do questionário.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

const GenerateSwotAnalysisOutputSchema = z.object({
  strengths: z.string().describe('As forças do indivíduo.'),
  weaknesses: z.string().describe('As fraquezas do indivíduo.'),
  opportunities: z.string().describe('As oportunidades para o indivíduo.'),
  threats: z.string().describe('As ameaças para o indivíduo.'),
});
export type GenerateSwotAnalysisOutput = z.infer<typeof GenerateSwotAnalysisOutputSchema>;

export async function generateSwotAnalysis(input: GenerateSwotAnalysisInput): Promise<GenerateSwotAnalysisOutput> {
  return generateSwotAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSwotAnalysisPrompt',
  input: {schema: GenerateSwotAnalysisInputSchema},
  output: {schema: GenerateSwotAnalysisOutputSchema},
  prompt: `Analise as seguintes respostas do questionário e gere uma análise SWOT.

Respostas do Questionário: {{{questionnaireResponses}}}

Forças: Uma lista de forças.
Fraquezas: Uma lista de fraquezas.
Oportunidades: Uma lista de oportunidades.
Ameaças: Uma lista de ameaças.`,
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
