'use server';

import { adminDb } from "@/lib/firebase-admin";
import type { Course } from "./courses";

/**
 * Fetches all courses from the Firestore 'courses' collection using the Admin SDK.
 * To be used in server-side contexts.
 * @returns A promise that resolves to an array of Course objects.
 */
export const getCoursesAdmin = async (): Promise<Course[]> => {
    try {
        const coursesCollection = adminDb.collection('courses');
        const coursesSnapshot = await coursesCollection.get();
        const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        return coursesList;
    } catch (error) {
        console.error("Error fetching courses with admin SDK:", error);
        throw new Error("Não foi possível carregar os cursos do servidor.");
    }
};

/**
 * Fetches a single course from the Firestore 'courses' collection using the Admin SDK.
 * @param id The ID of the course to fetch.
 * @returns A promise that resolves to a Course object or null if not found.
 */
export const getCourseAdmin = async (id: string): Promise<Course | null> => {
    try {
        const courseDoc = await adminDb.collection('courses').doc(id).get();
        if (!courseDoc.exists) {
            return null;
        }
        return { id: courseDoc.id, ...courseDoc.data() } as Course;
    } catch (error) {
        console.error(`Error fetching course ${id} with admin SDK:`, error);
        throw new Error("Não foi possível carregar o curso do servidor.");
    }
};
