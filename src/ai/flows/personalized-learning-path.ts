'use server';

/**
 * @fileOverview A personalized learning path generator based on SWOT analysis.
 *
 * - generatePersonalizedLearningPath - A function that generates a personalized learning path.
 * - PersonalizedLearningPathInput - The input type for the generatePersonalizedLearningPath function.
 * - PersonalizedLearningPathOutput - The return type for the generatePersonalizedLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningPathInputSchema = z.object({
  swotAnalysis: z
    .string()
    .describe(
      'A análise SWOT do usuário, incluindo forças, fraquezas, oportunidades e ameaças.'
    ),
  availableCourses: z
    .string()
    .describe('Uma lista de cursos disponíveis na plataforma com suas descrições.'),
});
export type PersonalizedLearningPathInput = z.infer<typeof PersonalizedLearningPathInputSchema>;

const PersonalizedLearningPathOutputSchema = z.object({
  learningPath: z
    .string()
    .describe(
      'Um plano de aprendizado personalizado com cursos recomendados em ordem de prioridade, com explicações para cada recomendação.'
    ),
});
export type PersonalizedLearningPathOutput = z.infer<typeof PersonalizedLearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(
  input: PersonalizedLearningPathInput
): Promise<PersonalizedLearningPathOutput> {
  return personalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: {schema: PersonalizedLearningPathInputSchema},
  output: {schema: PersonalizedLearningPathOutputSchema},
  prompt: `Você é um gerador de plano de aprendizado de IA. Você receberá uma análise SWOT de um usuário e uma lista de cursos disponíveis.

Você usará essas informações para gerar um plano de aprendizado personalizado para o usuário, recomendando cursos relevantes em ordem de prioridade.

Explique por que cada curso é recomendado com base na análise SWOT do usuário. Priorize cursos que abordem as fraquezas e ameaças do usuário.

Análise SWOT: {{{swotAnalysis}}}
Cursos Disponíveis: {{{availableCourses}}}`,
});

const personalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'personalizedLearningPathFlow',
    inputSchema: PersonalizedLearningPathInputSchema,
    outputSchema: PersonalizedLearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
