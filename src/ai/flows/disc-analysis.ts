'use server';
/**
 * @fileOverview Generates a DISC analysis based on questionnaire responses.
 *
 * - generateDiscAnalysis - A function that generates the DISC analysis.
 * - GenerateDiscAnalysisInput - The input type for the generateDiscAnalysis function.
 * - GenerateDiscAnalysisOutput - The return type for the generateDiscAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiscAnalysisInputSchema = z.object({
  discQuestionnaireResponses: z.string().describe('As respostas do questionário DISC.'),
});
export type GenerateDiscAnalysisInput = z.infer<typeof GenerateDiscAnalysisInputSchema>;

const GenerateDiscAnalysisOutputSchema = z.object({
  dominance: z.string().describe('Análise do perfil de Dominância (D).'),
  influence: z.string().describe('Análise do perfil de Influência (I).'),
  steadiness: z.string().describe('Análise do perfil de Estabilidade (S).'),
  conscientiousness: z.string().describe('Análise do perfil de Conformidade (C).'),
  profileSummary: z.string().describe('Um resumo do perfil DISC geral do indivíduo.'),
});
export type GenerateDiscAnalysisOutput = z.infer<typeof GenerateDiscAnalysisOutputSchema>;

export async function generateDiscAnalysis(input: GenerateDiscAnalysisInput): Promise<GenerateDiscAnalysisOutput> {
  return generateDiscAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiscAnalysisPrompt',
  input: {schema: GenerateDiscAnalysisInputSchema},
  output: {schema: GenerateDiscAnalysisOutputSchema},
  prompt: `Você é um especialista em análise de perfil comportamental DISC. Analise as seguintes respostas do questionário e gere uma análise DISC detalhada para cada um dos quatro perfis, além de um resumo geral.

Respostas do Questionário DISC: {{{discQuestionnaireResponses}}}

Análise de Dominância (D): Descreva as características de dominância da pessoa com base nas respostas.
Análise de Influência (I): Descreva as características de influência da pessoa com base nas respostas.
Análise de Estabilidade (S): Descreva as características de estabilidade da pessoa com base nas respostas.
Análise de Conformidade (C): Descreva as características de conformidade da pessoa com base nas respostas.
Resumo do Perfil: Forneça um resumo conciso do perfil comportamental geral do indivíduo.`,
});

const generateDiscAnalysisFlow = ai.defineFlow(
  {
    name: 'generateDiscAnalysisFlow',
    inputSchema: GenerateDiscAnalysisInputSchema,
    outputSchema: GenerateDiscAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
