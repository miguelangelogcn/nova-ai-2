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
      'The SWOT analysis of the user, including strengths, weaknesses, opportunities, and threats.'
    ),
  availableCourses: z
    .string()
    .describe('A list of available courses in the platform with their descriptions.'),
});
export type PersonalizedLearningPathInput = z.infer<typeof PersonalizedLearningPathInputSchema>;

const PersonalizedLearningPathOutputSchema = z.object({
  learningPath: z
    .string()
    .describe(
      'A personalized learning path with recommended courses in prioritized order, with explanations for each recommendation.'
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
  prompt: `You are an AI learning path generator. You will receive a SWOT analysis of a user and a list of available courses.

You will use this information to generate a personalized learning path for the user, recommending relevant courses in a prioritized order.

Explain why each course is recommended based on the user's SWOT analysis. Prioritize courses that address the user's weaknesses and threats.

SWOT Analysis: {{{swotAnalysis}}}
Available Courses: {{{availableCourses}}}`,
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
