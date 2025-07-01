'use server';

/**
 * @fileOverview A conversational AI mentor for nurses and technicians.
 *
 * - aiMentorChat - A function that handles the chat with the AI mentor.
 * - AiMentorChatInput - The input type for the aiMentorChat function.
 * - AiMentorChatOutput - The return type for the aiMentorChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiMentorChatInputSchema = z.object({
  message: z.string().describe('The message from the user to the AI mentor.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the AI mentor.'),
});
export type AiMentorChatInput = z.infer<typeof AiMentorChatInputSchema>;

const AiMentorChatOutputSchema = z.object({
  response: z.string().describe('The response from the AI mentor.'),
});
export type AiMentorChatOutput = z.infer<typeof AiMentorChatOutputSchema>;

export async function aiMentorChat(input: AiMentorChatInput): Promise<AiMentorChatOutput> {
  return aiMentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMentorChatPrompt',
  input: {schema: AiMentorChatInputSchema},
  output: {schema: AiMentorChatOutputSchema},
  prompt: `You are a helpful AI mentor for nurses and technicians. You are knowledgeable about all the content of the platform and can answer questions related to nursing and technical procedures.

Chat History:
{{#each chatHistory}}
  {{#if (eq role \"user\")}}User:{{else}}AI Mentor:{{/if}} {{content}}
{{/each}}

User: {{message}}
AI Mentor: `,
});

const aiMentorChatFlow = ai.defineFlow(
  {
    name: 'aiMentorChatFlow',
    inputSchema: AiMentorChatInputSchema,
    outputSchema: AiMentorChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
