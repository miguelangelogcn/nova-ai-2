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

const GeneratePersonalizedLearningPathInputSchema = z.object({
  swot: z.object({
    strengths: z.string(),
    weaknesses: z.string(),
    opportunities: z.string(),
    threats: z.string(),
  }),
  coursesAsString: z.string().describe("Uma string formatada listando todos os cursos disponíveis."),
});
export type GeneratePersonalizedLearningPathInput = z.infer<typeof GeneratePersonalizedLearningPathInputSchema>;

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  recommendedCourseIds: z.array(z.string()).describe('Uma lista ordenada de IDs de cursos recomendados, até um máximo de 5. Se nenhum curso for relevante, este deve ser um array vazio.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<typeof GeneratePersonalizedLearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(input: GeneratePersonalizedLearningPathInput): Promise<GeneratePersonalizedLearningPathOutput> {
  return generatePersonalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: { schema: GeneratePersonalizedLearningPathInputSchema },
  output: { schema: GeneratePersonalizedLearningPathOutputSchema },
  prompt: `Você é um especialista em desenvolvimento de carreira para profissionais de enfermagem.
Sua tarefa é criar uma trilha de aprendizado personalizada, recomendando até 5 cursos de uma lista fornecida.
Sua recomendação deve ser baseada na análise SWOT fornecida. Priorize cursos que abordem fraquezas e aproveitem oportunidades.

Você deve fornecer a saída no formato JSON especificado.
- O campo 'recommendedCourseIds' deve ser um array de strings (IDs dos cursos).
- Se nenhum curso for relevante, retorne um array vazio para 'recommendedCourseIds'.

Analise a seguinte SWOT:
- Forças: {{{swot.strengths}}}
- Fraquezas: {{{swot.weaknesses}}}
- Oportunidades: {{{swot.opportunities}}}
- Ameaças: {{{swot.threats}}}

Aqui está a lista de cursos disponíveis:
{{{coursesAsString}}}

Gere a lista de IDs de cursos recomendados.`,
});


const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async (input) => {
    if (!input.coursesAsString || input.coursesAsString.trim() === '') {
        return {
            recommendedCourseIds: [],
        };
    }
    
    const { output } = await prompt(input);

    if (!output) {
        throw new Error('A IA não retornou um resultado estruturado válido.');
    }

    return output;
  }
);
