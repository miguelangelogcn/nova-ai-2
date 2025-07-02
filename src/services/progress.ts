'use server';

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { getCourseAdmin } from './courses.admin';

// Action to mark a course as started
export async function startCourseAction(uid: string, courseId: string) {
    if (!uid || !courseId) return { success: false, error: 'UID ou ID do curso inválido.' };

    const userRef = adminDb.collection('users').doc(uid);
    const progressPath = `courseProgress.${courseId}`;

    try {
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        
        // Check if progress for this course already exists
        if (userData?.courseProgress?.[courseId]) {
            return { success: true, message: 'Curso já iniciado.' };
        }

        await userRef.update({
            [`${progressPath}.courseId`]: courseId,
            [`${progressPath}.startedAt`]: Timestamp.now(),
            [`${progressPath}.completedLessons`]: [],
        });
        
        revalidatePath(`/dashboard/courses/${courseId}`, 'layout');
        return { success: true };
    } catch (error: any) {
        console.error('Erro ao iniciar curso:', error);
        return { success: false, error: 'Falha ao registrar o início do curso.' };
    }
}

// Action to toggle a lesson's completion status
export async function toggleLessonCompletionAction(uid: string, courseId: string, lessonId: string) {
    if (!uid || !courseId || !lessonId) return { success: false, error: 'Dados inválidos.' };

    const userRef = adminDb.collection('users').doc(uid);
    const progressPath = `courseProgress.${courseId}`;

    try {
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const courseProgress = userData?.courseProgress?.[courseId];
        
        // Ensure the course has been started
        if (!courseProgress) {
            await startCourseAction(uid, courseId);
            const updatedUserDoc = await userRef.get(); // Re-fetch doc after starting
            const updatedUserData = updatedUserDoc.data();
            if (!updatedUserData?.courseProgress?.[courseId]) {
                throw new Error("Failed to initialize course progress before toggling lesson.");
            }
        }
        
        const completedLessons: string[] = courseProgress?.completedLessons || [];
        const isCompleted = completedLessons.includes(lessonId);

        if (isCompleted) {
            await userRef.update({
                [`${progressPath}.completedLessons`]: FieldValue.arrayRemove(lessonId),
                [`${progressPath}.completedAt`]: FieldValue.delete(), // Remove completion date if a lesson is undone
            });
        } else {
            await userRef.update({
                [`${progressPath}.completedLessons`]: FieldValue.arrayUnion(lessonId),
            });
        }

        // Check for course completion
        const course = await getCourseAdmin(courseId);
        if (course?.modules) {
            const totalLessons = course.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
            const updatedCompletedLessons = (await (await userRef.get()).data())?.courseProgress?.[courseId]?.completedLessons || [];
            
            if (totalLessons > 0 && updatedCompletedLessons.length === totalLessons) {
                await userRef.update({
                    [`${progressPath}.completedAt`]: Timestamp.now(),
                });
            }
        }
        
        revalidatePath(`/dashboard/courses`, 'layout');
        return { success: true, isCompleted: !isCompleted };
    } catch (error: any) {
        console.error('Erro ao marcar aula como concluída:', error);
        return { success: false, error: 'Falha ao atualizar o progresso da aula.' };
    }
}
