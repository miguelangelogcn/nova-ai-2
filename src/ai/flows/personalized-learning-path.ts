'use server';
/**
 * @fileOverview Generates a personalized learning path based on SWOT analysis and available courses.
 *
 * - generatePersonalizedLearningPath - A function that generates the learning path.
 * - GeneratePersonalizedLearningPathInput - The input type for the function.
 * - GeneratePersonalizedLearningPathOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CourseInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
});

const GeneratePersonalizedLearningPathInputSchema = z.object({
  swot: z.object({
    strengths: z.string(),
    weaknesses: z.string(),
    opportunities: z.string(),
    threats: z.string(),
  }),
  courses: z.array(CourseInfoSchema),
});
export type GeneratePersonalizedLearningPathInput = z.infer<typeof GeneratePersonalizedLearningPathInputSchema>;

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  recommendedCourseIds: z.array(z.string()).describe('An ordered list of recommended course IDs, up to a maximum of 5.'),
  reasoning: z.string().describe('A brief reasoning for the recommendation, explaining why these courses were chosen or why no courses were recommended.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<typeof GeneratePersonalizedLearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(input: GeneratePersonalizedLearningPathInput): Promise<GeneratePersonalizedLearningPathOutput> {
  // Guard clause: If there are no courses, return an empty path immediately without calling the AI.
  if (!input.courses || input.courses.length === 0) {
    return { recommendedCourseIds: [], reasoning: 'Não há cursos disponíveis na plataforma no momento para criar uma recomendação.' };
  }
  return generatePersonalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: { schema: GeneratePersonalizedLearningPathInputSchema },
  output: { schema: GeneratePersonalizedLearningPathOutputSchema },
  prompt: `Você é um especialista em desenvolvimento de carreira para profissionais de enfermagem. Sua tarefa é criar uma trilha de aprendizado personalizada com base na análise SWOT de um funcionário e nos cursos disponíveis.

Analise a SWOT a seguir:
- Forças: {{{swot.strengths}}}
- Fraquezas: {{{swot.weaknesses}}}
- Oportunidades: {{{swot.opportunities}}}
- Ameaças: {{{swot.threats}}}

Aqui está a lista de cursos disponíveis na plataforma:
{{#each courses}}
- ID do Curso: {{id}}
  - Título: {{title}}
  - Descrição: {{description}}
  - Categoria: {{category}}
{{/each}}

Com base na análise, recomende uma trilha de até 5 cursos em uma ordem priorizada. A prioridade deve ser dada a cursos que ajudem a mitigar as fraquezas e a aproveitar as oportunidades. Explique brevemente o raciocínio por trás da sua recomendação.

Se nenhum dos cursos disponíveis for relevante para as necessidades de desenvolvimento do funcionário, retorne um array vazio para 'recommendedCourseIds' e explique por que nenhuma recomendação foi feita no campo 'reasoning'.`,
});


const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
