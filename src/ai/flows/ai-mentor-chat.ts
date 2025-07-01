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
  message: z.string().describe('A mensagem do usuário para o mentor de IA.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('O histórico de chat entre o usuário e o mentor de IA.'),
});
export type AiMentorChatInput = z.infer<typeof AiMentorChatInputSchema>;

const AiMentorChatOutputSchema = z.object({
  response: z.string().describe('A resposta do mentor de IA.'),
});
export type AiMentorChatOutput = z.infer<typeof AiMentorChatOutputSchema>;

export async function aiMentorChat(input: AiMentorChatInput): Promise<AiMentorChatOutput> {
  return aiMentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMentorChatPrompt',
  input: {schema: AiMentorChatInputSchema},
  output: {schema: AiMentorChatOutputSchema},
  prompt: `Você é um mentor de IA prestativo para enfermeiros e técnicos. Você conhece todo o conteúdo da plataforma e pode responder a perguntas relacionadas à enfermagem e procedimentos técnicos.

Histórico do Chat:
{{#each chatHistory}}
  {{#if (eq role "user")}}Usuário:{{else}}Mentor de IA:{{/if}} {{content}}
{{/each}}

Usuário: {{message}}
Mentor de IA: `,
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
