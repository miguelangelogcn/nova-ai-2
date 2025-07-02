'use server';

/**
 * @fileOverview A conversational AI assistant for managers.
 *
 * - auroraAssistantChat - A function that handles the chat with the Aurora assistant.
 * - AuroraAssistantChatInput - The input type for the auroraAssistantChat function.
 * - AuroraAssistantChatOutput - The return type for the auroraAssistantChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const reportData = `
Relatório de Acessos ao Sistema (Módulo 1 - Funcionários):
- Mês: Janeiro, Desktop: 186 acessos, Mobile: 109 acessos.
- Mês: Fevereiro, Desktop: 220 acessos, Mobile: 132 acessos.
- Mês: Março, Desktop: 345 acessos, Mobile: 298 acessos.
- Mês: Abril, Desktop: 412 acessos, Mobile: 350 acessos.
- Mês: Maio, Desktop: 580 acessos, Mobile: 490 acessos.
- Mês: Junho, Desktop: 650 acessos, Mobile: 510 acessos.
Resumo: A tendência geral de acessos é de crescimento tanto para desktop quanto para mobile. O desktop continua sendo a plataforma predominante para o acesso.
`.trim();

const AuroraAssistantChatInputSchema = z.object({
  message: z.string().describe('A mensagem do gestor para a assistente Aurora.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('O histórico de chat entre o gestor e a Aurora.'),
});
export type AuroraAssistantChatInput = z.infer<typeof AuroraAssistantChatInputSchema>;

const AuroraAssistantChatOutputSchema = z.object({
  response: z.string().describe('A resposta da assistente Aurora.'),
});
export type AuroraAssistantChatOutput = z.infer<typeof AuroraAssistantChatOutputSchema>;

export async function auroraAssistantChat(input: AuroraAssistantChatInput): Promise<AuroraAssistantChatOutput> {
  return auroraAssistantChatFlow(input);
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
  name: 'auroraAssistantChatPrompt',
  input: {schema: InternalPromptInputSchema},
  output: {schema: AuroraAssistantChatOutputSchema},
  prompt: `Você é Aurora, uma assistente de IA para gestores na plataforma de saúde Nova AI. Seu nome é Aurora. Você é especializada em analisar dados, identificar tendências e fornecer insights acionáveis com base nos relatórios da plataforma. Seja concisa e direta ao ponto.

Você tem acesso aos seguintes dados de relatório:
---
${reportData}
---

Responda às perguntas do gestor. Se não houver dados, informe que os relatórios ainda não estão disponíveis ou que você não tem acesso a essa informação.

Histórico do Chat:
{{#each chatHistory}}
  {{#if isUser}}Gestor:{{else}}Aurora:{{/if}} {{content}}
{{/each}}

Gestor: {{message}}
Aurora: `,
});

const auroraAssistantChatFlow = ai.defineFlow(
  {
    name: 'auroraAssistantChatFlow',
    inputSchema: AuroraAssistantChatInputSchema,
    outputSchema: AuroraAssistantChatOutputSchema,
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
