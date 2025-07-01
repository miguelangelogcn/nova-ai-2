import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { GenerateSwotAnalysisOutput, PersonalizedLearningPathOutput } from "@/app/questionnaire/types";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export type AppUser = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: "enfermeiro" | "tecnico" | "admin";
    team?: string;
    createdAt: any;
    status: "Ativo" | "Inativo";
    swot?: GenerateSwotAnalysisOutput;
    path?: PersonalizedLearningPathOutput;
};

export const createUserProfile = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { displayName, email, photoURL, uid } = user;
        try {
            await setDoc(userRef, {
                uid,
                displayName: displayName ?? email,
                email,
                photoURL: photoURL ?? '',
                role: "enfermeiro",
                createdAt: serverTimestamp(),
                status: "Ativo",
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    }
    return getUserProfile(user.uid);
};

export const getUserProfile = async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        return snapshot.data() as AppUser;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<AppUser>) => {
    const userRef = doc(db, "users", uid);
    try {
        await updateDoc(userRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
};

// Admin Functions
export const adminGetAllUsers = async (): Promise<AppUser[]> => {
    const snapshot = await adminDb.collection("users").orderBy("displayName").get();
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
    return await getUserProfile(uid);
};

export const adminDeleteUser = async (uid: string) => {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("users").doc(uid).delete();
};
