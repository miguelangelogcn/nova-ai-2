import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { GenerateSwotAnalysisOutput } from "@/app/questionnaire/types";

export type Assessment = {
    swot: GenerateSwotAnalysisOutput;
    questionnaireResponses: Record<string, string>;
    appliedAt: any; // Stored as Timestamp, received as ISO string
};

export type AppUser = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: "enfermeiro" | "tecnico" | "admin";
    team?: string;
    createdAt: any;
    status: "Ativo" | "Inativo";
    assessments?: Assessment[];
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
                assessments: [],
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    }
    return getUserProfile(user.uid);
};

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        const data = snapshot.data();
        // Convert Firestore Timestamps to serializable format if they exist
        const serializableData = {
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
            // Sort assessments by date, newest first, and serialize timestamp
            assessments: (data.assessments || [])
                .map((assessment: any) => ({
                    ...assessment,
                    appliedAt: assessment.appliedAt?.toDate ? assessment.appliedAt.toDate().toISOString() : new Date().toISOString(),
                }))
                .sort((a: Assessment, b: Assessment) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()),
        };
        return serializableData as AppUser;
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
