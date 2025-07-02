'use server';

import { auroraAssistantChat, type AuroraAssistantChatInput } from '@/ai/flows/aurora-assistant-chat';
import { startConversation, addChatTurn } from '@/services/aurora-conversations';
import { revalidatePath } from 'next/cache';

export async function startAuroraConversationAction(userId: string) {
    if (!userId) {
        return { success: false, error: 'Usuário não autenticado.' };
    }
    try {
        const conversationId = await startConversation(userId);
        revalidatePath('/dashboard/admin/aurora');
        return { success: true, conversationId };
    } catch (error) {
        console.error("Error starting Aurora conversation:", error);
        return { success: false, error: 'Não foi possível iniciar uma nova conversa.' };
    }
}


export async function handleAuroraChat(conversationId: string, message: string, chatHistory: AuroraAssistantChatInput['chatHistory']) {
    try {
        // Get the AI's response first
        const result = await auroraAssistantChat({ message, chatHistory });
        
        // Then, persist both messages to the database
        await addChatTurn(conversationId, message, result.response);
        
        return { success: true, response: result.response };
    } catch (error) {
        console.error("Error in Aurora Assistant chat:", error);
        const errorMessage = "Desculpe, estou com problemas para me conectar agora. Por favor, tente novamente mais tarde.";
        return { success: false, response: errorMessage };
    }
}
