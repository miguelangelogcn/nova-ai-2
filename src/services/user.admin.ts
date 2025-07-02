'use server';

import { adminDb } from '@/lib/firebase-admin';
import { type AppUser, type Assessment, type LearningPath } from '@/services/user';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import type { GenerateSwotAnalysisOutput, GenerateDiscAnalysisOutput } from '@/app/questionnaire/types';

// A helper type for what we get from admin SDK, where createdAt is a Firestore Timestamp
type FirestoreAppUser = Omit<AppUser, 'createdAt' | 'assessments' | 'courseProgress'> & {
    createdAt: Timestamp;
    assessments?: (Omit<Assessment, 'appliedAt'> & { appliedAt: Timestamp })[];
    courseProgress?: Record<string, Omit<CourseProgress, 'startedAt' | 'completedAt'> & { startedAt: Timestamp, completedAt?: Timestamp }>;
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

        // Serialize timestamps within courseProgress to make them safe for client components
        const courseProgress = data.courseProgress || {};
        for (const courseId in courseProgress) {
            const progress = courseProgress[courseId] as any;
            if (progress.startedAt && typeof progress.startedAt.toDate === 'function') {
                progress.startedAt = progress.startedAt.toDate().toISOString();
            }
            if (progress.completedAt && typeof progress.completedAt.toDate === 'function') {
                progress.completedAt = progress.completedAt.toDate().toISOString();
            }
        }
        
        // Also serialize timestamps within assessments to make them safe for client components
        const assessments = (data.assessments || [])
            .map((assessment) => ({
                ...assessment,
                appliedAt: assessment.appliedAt.toDate().toISOString(),
            }))
            .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

        return {
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
            assessments,
            courseProgress,
        } as AppUser;
    });
    return users;
}

/**
 * Fetches a single user from the Firestore 'users' collection using the Admin SDK.
 * @param uid The user's ID.
 * @returns A promise that resolves to an AppUser object or null if not found.
 */
export async function getUserAdmin(uid: string): Promise<AppUser | null> {
    if (!adminDb) {
        throw new Error("A conexão com o banco de dados do Admin não foi inicializada.");
    }
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        return null;
    }
    const data = userDoc.data() as FirestoreAppUser;
    
     // Serialize timestamps within courseProgress to make them safe for client components
    const courseProgress = data.courseProgress || {};
    for (const courseId in courseProgress) {
        const progress = courseProgress[courseId] as any;
        if (progress.startedAt && typeof progress.startedAt.toDate === 'function') {
            progress.startedAt = progress.startedAt.toDate().toISOString();
        }
        if (progress.completedAt && typeof progress.completedAt.toDate === 'function') {
            progress.completedAt = progress.completedAt.toDate().toISOString();
        }
    }
    
    const assessments = (data.assessments || [])
        .map((assessment) => ({
            ...assessment,
            appliedAt: assessment.appliedAt.toDate().toISOString(),
        }))
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    return {
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
        assessments,
        courseProgress,
    } as AppUser;
}


/**
 * Adds a new assessment record to a user's profile in Firestore.
 * This is a server-side function using the Admin SDK.
 * @param uid The user's ID.
 * @param data The assessment data, including SWOT and questionnaire responses.
 */
export async function addAssessmentToProfile(uid: string, data: { swot: GenerateSwotAnalysisOutput; disc?: GenerateDiscAnalysisOutput; learningPath?: LearningPath, questionnaireResponses: Record<string, string> }) {
    const userRef = adminDb.collection("users").doc(uid);
    const newAssessment = {
        ...data,
        appliedAt: Timestamp.now(), // Use Admin SDK's Timestamp
    };
    try {
        await userRef.update({
            assessments: FieldValue.arrayUnion(newAssessment),
        });
    } catch (error) {
        console.error("Error adding assessment to profile (admin):", error);
        // Re-throw a more user-friendly error
        throw new Error("Ocorreu um erro ao salvar sua avaliação no banco de dados.");
    }
}
