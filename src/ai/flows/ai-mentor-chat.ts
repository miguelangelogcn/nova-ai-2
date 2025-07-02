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
  message: z.string().describe('A mensagem do usuário para a mentora.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('O histórico de chat entre o usuário e a mentora.'),
});
export type AiMentorChatInput = z.infer<typeof AiMentorChatInputSchema>;

const AiMentorChatOutputSchema = z.object({
  response: z.string().describe('A resposta da mentora.'),
});
export type AiMentorChatOutput = z.infer<typeof AiMentorChatOutputSchema>;

export async function aiMentorChat(input: AiMentorChatInput): Promise<AiMentorChatOutput> {
  return aiMentorChatFlow(input);
}

// Internal schema for the prompt that includes a boolean flag for easier templating.
const InternalPromptInputSchema = z.object({
    message: z.string(),
    chatHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        isUser: z.boolean(),
    })).optional(),
});

const prompt = ai.definePrompt({
  name: 'aiMentorChatPrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: AiMentorChatOutputSchema},
  prompt: `Você é Florence, uma mentora prestativa para enfermeiros e técnicos. Seu nome é Florence. Você conhece todo o conteúdo da plataforma e pode responder a perguntas relacionadas à enfermagem e procedimentos técnicos.

Histórico do Chat:
{{#each chatHistory}}
  {{#if isUser}}Usuário:{{else}}Florence:{{/if}} {{content}}
{{/each}}

Usuário: {{message}}
Florence: `,
});

const aiMentorChatFlow = ai.defineFlow(
  {
    name: 'aiMentorChatFlow',
    inputSchema: AiMentorChatInputSchema,
    outputSchema: AiMentorChatOutputSchema,
  },
  async (input) => {
    // The client sends the full history including the current user message.
    // The prompt also uses a {{message}} placeholder for it.
    // To avoid duplication, we pass the history *without* the last message.
    const historyForPrompt = input.chatHistory ? input.chatHistory.slice(0, -1) : [];
    
    // Process the history to add the 'isUser' flag for Handlebars.
    const processedHistory = historyForPrompt.map(turn => ({
        ...turn,
        isUser: turn.role === 'user',
    }));

    const {output} = await prompt({
        message: input.message,
        chatHistory: processedHistory,
    });
    
    return output!;
  }
);
