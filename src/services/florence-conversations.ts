'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { addLog } from './logs';

export type FlorenceConversation = {
    id: string;
    userId: string;
    startedAt: string; // ISO string
    lastInteractionAt: string; // ISO string
    status: 'open' | 'closed';
    messageCount: number;
};

export type FlorenceMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string; // ISO string
}

type FirestoreConversation = Omit<FlorenceConversation, 'id' | 'startedAt' | 'lastInteractionAt'> & {
    startedAt: Timestamp;
    lastInteractionAt: Timestamp;
};

type FirestoreMessage = Omit<FlorenceMessage, 'id' | 'timestamp'> & {
    timestamp: Timestamp;
};

/**
 * Starts a new conversation session for a user with Florence.
 * @param userId - The ID of the user starting the conversation.
 * @returns The ID of the newly created conversation.
 */
export async function startConversation(userId: string): Promise<string> {
    const conversationRef = adminDb.collection('florence-conversations').doc();
    const now = Timestamp.now();
    
    const newConversation: FirestoreConversation = {
        userId,
        startedAt: now,
        lastInteractionAt: now,
        status: 'open',
        messageCount: 0,
    };
    
    await conversationRef.set(newConversation);
    
    await addLog(userId, 'CHAT_STARTED', { chatType: 'Florence' });

    revalidatePath('/dashboard/mentor');
    
    return conversationRef.id;
}

/**
 * Adds messages to a Florence conversation and updates the last interaction time.
 * @param conversationId - The ID of the conversation.
 * @param userMessage - The user's message content.
 * @param assistantMessage - The assistant's message content.
 */
export async function addChatTurn(conversationId: string, userMessage: string, assistantMessage: string): Promise<void> {
    const conversationRef = adminDb.collection('florence-conversations').doc(conversationId);
    const messagesCollectionRef = conversationRef.collection('messages');
    
    const userMessageRef = messagesCollectionRef.doc();
    const assistantMessageRef = messagesCollectionRef.doc();
    
    const now = Timestamp.now();
    
    const batch = adminDb.batch();

    // Add user message
    batch.set(userMessageRef, {
        role: 'user',
        content: userMessage,
        timestamp: now,
    } as FirestoreMessage);
    
    // Add assistant message
    batch.set(assistantMessageRef, {
        role: 'assistant',
        content: assistantMessage,
        timestamp: now,
    } as FirestoreMessage);
    
    // Update conversation metadata
    batch.update(conversationRef, {
        lastInteractionAt: now,
        messageCount: FieldValue.increment(2),
    });
    
    await batch.commit();
}

/**
* Note: A background function/job would be needed to automatically close conversations
* that have been inactive for more than 10 minutes.
*/
