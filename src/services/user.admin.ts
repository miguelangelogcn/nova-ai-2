'use server';

import { adminDb } from '@/lib/firebase-admin';
import { AppUser } from '@/services/user';
import { Timestamp } from 'firebase-admin/firestore';

// A helper type for what we get from admin SDK, where createdAt is a Firestore Timestamp
type FirestoreAppUser = Omit<AppUser, 'createdAt'> & {
    createdAt: Timestamp;
};

/**
 * Fetches all users from the Firestore 'users' collection using the Admin SDK.
 * @returns A promise that resolves to an array of AppUser objects.
 */
export async function getAllUsers(): Promise<AppUser[]> {
    if (!adminDb) {
        throw new Error("A conexão com o banco de dados do Admin não foi inicializada.");
    }
    const usersSnapshot = await adminDb.collection('users').get();
    const users = usersSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreAppUser;
        return {
            ...data,
            // Convert Firestore Timestamp to a serializable format (ISO string) for the client component
            createdAt: data.createdAt.toDate().toISOString(),
        } as AppUser;
    });
    return users;
}
