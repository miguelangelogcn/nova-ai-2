'use client';

import { getCourse, type Course, type Module } from "@/services/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PlayCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function ModuleLessonsPage() {
    const params = useParams<{ id: string, moduleId: string }>();
    const courseId = params?.id;
    const moduleId = params?.moduleId;

    const [course, setCourse] = useState<Course | null>(null);
    const [module, setModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(true);
    const { appUser, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId || !moduleId) return;
            setLoading(true);
            try {
                const fetchedCourse = await getCourse(courseId);
                setCourse(fetchedCourse);
                if (fetchedCourse?.modules) {
                    const currentModule = fetchedCourse.modules.find(m => m.id === moduleId);
                    setModule(currentModule || null);
                }
            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, moduleId]);

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!course || !module) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Conteúdo não encontrado</CardTitle>
                    <CardDescription>Não foi possível encontrar o módulo solicitado. ID do Curso: {courseId || 'N/A'}, ID do Módulo: {moduleId || 'N/A'}</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const lessons = module.lessons || [];
    const completedLessons = appUser?.courseProgress?.[courseId]?.completedLessons || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/courses" className="hover:underline">Cursos</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/dashboard/courses/${courseId}`} className="hover:underline">{course.title}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-foreground">{module.title}</span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                     <h3 className="text-xl font-bold font-headline mb-4">Aulas</h3>
                     {lessons.length > 0 ? (
                         <ul className="space-y-3">
                            {lessons.map((lesson) => {
                                const isCompleted = completedLessons.includes(lesson.id);
                                return (
                                    <li key={lesson.id}>
                                        <Link href={`/dashboard/courses/${courseId}/module/${moduleId}/lesson/${lesson.id}`} className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                            {isCompleted ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <PlayCircle className="h-6 w-6 text-accent" />}
                                            <span className="flex-1 font-medium">{lesson.title}</span>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </Link>
                                    </li>
                                )
                            })}
                         </ul>
                     ) : (
                         <p className="text-sm text-muted-foreground">Ainda não há aulas neste módulo.</p>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}
