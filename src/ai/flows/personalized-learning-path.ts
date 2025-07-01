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
  coursesAsString: z.string().describe("A formatted string listing all available courses."),
});
export type GeneratePersonalizedLearningPathInput = z.infer<typeof GeneratePersonalizedLearningPathInputSchema>;

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  recommendedCourseIds: z.array(z.string()).describe('An ordered list of recommended course IDs, up to a maximum of 5. If no courses are relevant, this must be an empty array.'),
  reasoning: z.string().describe('A brief reasoning for the recommendation, explaining why these courses were chosen. If no courses are recommended, explain why.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<typeof GeneratePersonalizedLearningPathOutputSchema>;

export async function generatePersonalizedLearningPath(input: GeneratePersonalizedLearningPathInput): Promise<GeneratePersonalizedLearningPathOutput> {
  return generatePersonalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningPathPrompt',
  input: { schema: GeneratePersonalizedLearningPathInputSchema },
  output: { schema: GeneratePersonalizedLearningPathOutputSchema },
  prompt: `You are a career development expert for nursing professionals. Your task is to create a personalized learning path by recommending up to 5 courses from a given list.
Your recommendation must be based on the provided SWOT analysis. Prioritize courses that address weaknesses and leverage opportunities.
You must provide the output in the specified JSON format. The 'recommendedCourseIds' field must be an array of strings (course IDs). The 'reasoning' field must be a string explaining your choices.
If no courses are relevant, return an empty array for 'recommendedCourseIds' and explain why in the 'reasoning' field.

Analyze the following SWOT:
- Strengths: {{{swot.strengths}}}
- Weaknesses: {{{swot.weaknesses}}}
- Opportunities: {{{swot.opportunities}}}
- Threats: {{{swot.threats}}}

Here is the list of available courses:
{{{coursesAsString}}}

Based on this information, generate the learning path.`,
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
