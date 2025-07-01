import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export type AppUser = {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: "nurse" | "technician" | "admin";
    team?: string;
    createdAt: any;
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
                role: "nurse",
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
