'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { getUserAdmin } from './user.admin';
import type { AppUser } from './user';

export type LoggableAction =
  | 'USER_LOGIN' | 'USER_LOGOUT'
  | 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED'
  | 'TEAM_CREATED' | 'TEAM_UPDATED' | 'TEAM_DELETED'
  | 'CARGO_CREATED' | 'CARGO_UPDATED' | 'CARGO_DELETED'
  | 'ASSESSMENT_COMPLETED'
  | 'COURSE_STARTED' | 'LESSON_COMPLETED'
  | 'CHAT_STARTED';

export type Log = {
    id: string;
    timestamp: string; // ISO string
    actorUid: string;
    actorName: string;
    actorRole: AppUser['role'];
    action: LoggableAction;
    details: Record<string, any>;
}

type FirestoreLog = Omit<Log, 'id' | 'timestamp'> & {
    timestamp: Timestamp;
};

/**
 * Creates a log entry in Firestore.
 * @param actorUid The UID of the user performing the action.
 * @param action The type of action performed.
 * @param details An object with context-specific details about the action.
 */
export async function addLog(actorUid: string, action: LoggableAction, details: Record<string, any> = {}) {
    if (!actorUid) {
        console.warn(`[addLog] Attempted to log action "${action}" without an actor UID.`);
        return;
    }

    try {
        const actor = await getUserAdmin(actorUid);
        
        const logEntry: Omit<FirestoreLog, 'id'> = {
            timestamp: Timestamp.now(),
            actorUid: actorUid,
            actorName: actor?.displayName || 'Usuário Desconhecido',
            actorRole: actor?.role || 'N/A',
            action: action,
            details: details,
        };

        await adminDb.collection('logs').add(logEntry);

    } catch (error) {
        console.error(`[addLog] Failed to write log for action ${action} by user ${actorUid}`, error);
    }
}

/**
 * Fetches all logs from Firestore, ordered by most recent.
 * @returns A promise that resolves to an array of Log objects.
 */
export async function getLogs(): Promise<Log[]> {
    const logsSnapshot = await adminDb.collection('logs').orderBy('timestamp', 'desc').limit(200).get();
    
    const logs = logsSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreLog;
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate().toISOString(),
        } as Log;
    });

    return logs;
}
