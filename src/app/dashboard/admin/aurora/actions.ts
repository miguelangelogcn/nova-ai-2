'use server';

import { auroraAssistantChat, type AuroraAssistantChatInput } from '@/ai/flows/aurora-assistant-chat';

export async function handleAuroraChat(message: string, chatHistory: AuroraAssistantChatInput['chatHistory']) {
    try {
        const result = await auroraAssistantChat({ message, chatHistory });
        return result.response;
    } catch (error) {
        console.error("Error in Aurora Assistant chat:", error);
        return "Desculpe, estou com problemas para me conectar agora. Por favor, tente novamente mais tarde.";
    }
}
