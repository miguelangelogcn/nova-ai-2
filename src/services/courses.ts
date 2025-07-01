import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export type Lesson = Record<string, {
    title: string;
}>;

export type Module = Record<string, {
    title: string;
    description?: string;
    lessons: Lesson[];
}>;

export type Course = {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    dataAiHint: string;
    content?: {
        about: string;
        modules: Module[];
    }
};

export const getCourses = async (): Promise<Course[]> => {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    return coursesList;
};

export const getCourse = async (id: string): Promise<Course | null> => {
    const courseDoc = doc(db, 'courses', id);
    const courseSnapshot = await getDoc(courseDoc);
    if (courseSnapshot.exists()) {
        return { id: courseSnapshot.id, ...courseSnapshot.data() } as Course;
    }
    return null;
};
