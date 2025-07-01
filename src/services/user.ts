import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { GenerateSwotAnalysisOutput, PersonalizedLearningPathOutput } from "@/app/questionnaire/types";

export type AppUser = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: "enfermeiro" | "tecnico" | "admin";
    team?: string;
    createdAt: any;
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
