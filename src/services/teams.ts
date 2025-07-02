'use server';

import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export type Team = {
    id: string;
    name: string;
    description?: string;
    createdAt: string; // ISO string
};

type FirestoreTeam = Omit<Team, 'id' | 'createdAt'> & {
    createdAt: Timestamp;
};

/**
 * Fetches a single team from the Firestore 'teams' collection.
 * @param id - The ID of the team to fetch.
 * @returns A promise that resolves to a Team object or null if not found.
 */
export async function getTeam(id: string): Promise<Team | null> {
    const teamDoc = await adminDb.collection('teams').doc(id).get();
    if (!teamDoc.exists) {
        return null;
    }
    const data = teamDoc.data() as FirestoreTeam;
    return {
        id: teamDoc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
    };
}


/**
 * Fetches all teams from the Firestore 'teams' collection.
 * @returns A promise that resolves to an array of Team objects.
 */
export async function getTeams(): Promise<Team[]> {
    const teamsSnapshot = await adminDb.collection('teams').orderBy('name').get();
    const teams = teamsSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreTeam;
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
        } as Team;
    });
    return teams;
}

/**
 * Adds a new team to the Firestore 'teams' collection.
 * @param name - The name of the team.
 * @param description - The description of the team.
 */
export async function addTeam(name: string, description?: string): Promise<{ id: string }> {
    const teamRef = adminDb.collection('teams').doc();
    const newTeam: FirestoreTeam = {
        name,
        description: description ?? '',
        createdAt: Timestamp.now(),
    };
    await teamRef.set(newTeam);
    
    // Revalidate paths where teams are used
    revalidatePath('/dashboard/admin/teams');
    revalidatePath('/dashboard/admin/users');

    return { id: teamRef.id };
}

/**
 * Updates an existing team in the Firestore 'teams' collection.
 * @param id - The ID of the team to update.
 * @param data - The data to update.
 */
export async function updateTeam(id: string, data: { name: string, description?: string }): Promise<void> {
    const teamRef = adminDb.collection('teams').doc(id);
    await teamRef.update({
        name: data.name,
        description: data.description ?? '',
    });
    
    revalidatePath('/dashboard/admin/teams');
    revalidatePath('/dashboard/admin/users');
}

/**
 * Deletes a team from the Firestore 'teams' collection.
 * @param id - The ID of the team to delete.
 */
export async function deleteTeam(id: string): Promise<void> {
    const teamRef = adminDb.collection('teams').doc(id);
    await teamRef.delete();
    
    revalidatePath('/dashboard/admin/teams');
    revalidatePath('/dashboard/admin/users');
}
