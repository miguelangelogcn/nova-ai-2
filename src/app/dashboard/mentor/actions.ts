'use server';

import { aiMentorChat, type AiMentorChatInput } from '@/ai/flows/ai-mentor-chat';

export async function handleChat(message: string, chatHistory: AiMentorChatInput['chatHistory']) {
    try {
        const result = await aiMentorChat({ message, chatHistory });
        return result.response;
    } catch (error) {
        console.error("Error in AI Mentor chat:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
}
