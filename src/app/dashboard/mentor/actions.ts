'use server';

import { aiMentorChat, type AiMentorChatInput } from '@/ai/flows/ai-mentor-chat';
import { startConversation, addChatTurn } from '@/services/florence-conversations';
import { revalidatePath } from 'next/cache';

export async function startFlorenceConversationAction(userId: string) {
    if (!userId) {
        return { success: false, error: 'Usuário não autenticado.' };
    }
    try {
        const conversationId = await startConversation(userId);
        revalidatePath('/dashboard/mentor');
        return { success: true, conversationId };
    } catch (error) {
        console.error("Error starting Florence conversation:", error);
        return { success: false, error: 'Não foi possível iniciar uma nova conversa.' };
    }
}

export async function handleChat(conversationId: string, message: string, chatHistory: AiMentorChatInput['chatHistory']) {
    try {
        const result = await aiMentorChat({ message, chatHistory });
        await addChatTurn(conversationId, message, result.response);
        return { success: true, response: result.response };
    } catch (error) {
        console.error("Error in AI Mentor chat:", error);
        const errorMessage = "Desculpe, estou com problemas para me conectar agora. Por favor, tente novamente mais tarde.";
        return { success: false, response: errorMessage };
    }
}