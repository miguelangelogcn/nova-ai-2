'use server';

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { AppUser } from "./user";

// Admin Functions
export const adminGetAllUsers = async (): Promise<AppUser[]> => {
    const snapshot = await adminDb.collection("users").get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data() as AppUser);
};

export const adminCreateUser = async (data: any) => {
    const { email, password, displayName, role, team, status } = data;
    const userRecord = await adminAuth.createUser({ email, password, displayName });
    
    const newUser: AppUser = {
        uid: userRecord.uid,
        email,
        displayName,
        photoURL: '',
        role,
        team,
        status,
        createdAt: new Date(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(newUser);
    return newUser;
};

export const adminUpdateUser = async (uid: string, data: Partial<Omit<AppUser, 'email' | 'uid' | 'createdAt' | 'photoURL'>>) => {
    await adminDb.collection("users").doc(uid).update(data);
    if (data.displayName) {
        await adminAuth.updateUser(uid, { displayName: data.displayName });
    }
};

export const adminDeleteUser = async (uid: string) => {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("users").doc(uid).delete();
};
