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
  reasoning: z.string().describe('Uma breve justificativa para a recomendação. Se nenhum curso for recomendado, explique o porquê. A justificativa DEVE ser em português.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<typeof GeneratePersonalizedLearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(input: GeneratePersonalizedLearningPathInput): Promise<GeneratePersonalizedLearningPathOutput> {
  return generatePersonalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: { schema: GeneratePersonalizedLearningPathInputSchema },
  output: { schema: GeneratePersonalizedLearningPathOutputSchema },
  prompt: `Você é um especialista em desenvolvimento de carreira para profissionais de enfermagem e sua tarefa é gerar respostas exclusivamente em português do Brasil.
Sua tarefa é criar uma trilha de aprendizado personalizada, recomendando até 5 cursos de uma lista fornecida.
Sua recomendação deve ser baseada na análise SWOT fornecida. Priorize cursos que abordem fraquezas e aproveitem oportunidades.

Você deve fornecer a saída no formato JSON especificado.
- O campo 'recommendedCourseIds' deve ser um array de strings (IDs dos cursos).
- O campo 'reasoning' deve ser uma string explicando suas escolhas.

Se nenhum curso for relevante, retorne um array vazio para 'recommendedCourseIds' e explique o porquê no campo 'reasoning'.

Analise a seguinte SWOT:
- Forças: {{{swot.strengths}}}
- Fraquezas: {{{swot.weaknesses}}}
- Oportunidades: {{{swot.opportunities}}}
- Ameaças: {{{swot.threats}}}

Aqui está a lista de cursos disponíveis:
{{{coursesAsString}}}

Com base nessas informações, gere a trilha de aprendizado. Lembre-se: a justificativa no campo 'reasoning' deve ser OBRIGATORIAMENTE escrita em português do Brasil.`,
});


const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async (input) => {
    // Handle case where no courses are available to avoid unnecessary AI call
    if (!input.coursesAsString || input.coursesAsString.trim() === '') {
        return {
            recommendedCourseIds: [],
            reasoning: 'Nenhum curso disponível no momento para gerar uma trilha de aprendizado.',
        };
    }
    
    const { output } = await prompt(input);

    if (!output) {
        throw new Error('A IA não retornou um resultado estruturado válido.');
    }

    return output;
  }
);
