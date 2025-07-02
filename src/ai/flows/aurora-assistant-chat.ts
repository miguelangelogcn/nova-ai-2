'use server';

/**
 * @fileOverview A conversational AI assistant for managers.
 *
 * - auroraAssistantChat - A function that handles the chat with the Aurora assistant.
 * - AuroraAssistantChatInput - The input type for the auroraAssistantChat function.
 * - AuroraAssistantChatOutput - The return type for the auroraAssistantChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// For now, the reports are static. In the future, this could be dynamic data passed in.
const reportData = `
- Total de Usuários: 128
- Cursos Concluídos (este mês): 342
- Taxa de Engajamento: 87%
- Principal Dúvida (Florence): Dosagem de Medicação
- Conclusões por Mês: Janeiro (186), Fevereiro (305), Março (237), Abril (73), Maio (209), Junho (214)
`;

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

const prompt = ai.definePrompt({
  name: 'auroraAssistantChatPrompt',
  input: {schema: AuroraAssistantChatInputSchema},
  output: {schema: AuroraAssistantChatOutputSchema},
  prompt: `Você é Aurora, uma assistente de IA para gestores na plataforma de saúde Nova AI. Seu nome é Aurora. Você é especializada em analisar dados, identificar tendências e fornecer insights acionáveis com base nos relatórios da plataforma. Seja concisa e direta ao ponto.

Você tem acesso aos seguintes dados de relatório:
---
${reportData}
---

Responda às perguntas do gestor com base nesses dados. Você pode cruzar informações e gerar análises.

Histórico do Chat:
{{#each chatHistory}}
  {{#if (eq role "user")}}Gestor:{{else}}Aurora:{{/if}} {{content}}
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
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
