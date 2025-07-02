'use client';

import { getCourse, type Course, type Module, type Lesson } from "@/services/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, ChevronRight, FileText, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { toggleLessonCompletionAction } from "@/services/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function getYouTubeEmbedUrl(url: string) {
    if (!url) return '';
    if (url.includes('embed')) return url;
    const videoId = url.split('v=')[1];
    if (videoId) {
        const ampersandPosition = videoId.indexOf('&');
        if (ampersandPosition !== -1) {
            return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return '';
}

export default function LessonContentPage() {
    const params = useParams<{ id: string, moduleId: string, lessonId: string }>();
    const courseId = params?.id;
    const moduleId = params?.moduleId;
    const lessonId = params?.lessonId;

    const [course, setCourse] = useState<Course | null>(null);
    const [module, setModule] = useState<Module | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const { user, appUser, refreshAppUser, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchCourseData = async () => {
            if (!courseId || !moduleId || !lessonId) return;
            setLoading(true);
            try {
                const fetchedCourse = await getCourse(courseId);
                setCourse(fetchedCourse);
                if (fetchedCourse?.modules) {
                    const currentModule = fetchedCourse.modules.find(m => m.id === moduleId);
                    setModule(currentModule || null);
                    if (currentModule?.lessons) {
                        const currentLesson = currentModule.lessons.find(l => l.id === lessonId);
                        setLesson(currentLesson || null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch course data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, moduleId, lessonId]);
    
    const handleToggleCompletion = async () => {
        if (!user || !courseId || !lessonId) return;
        setIsSubmitting(true);
        try {
            const result = await toggleLessonCompletionAction(user.uid, courseId, lessonId);
            if (result.success) {
                toast({
                    title: "Progresso Atualizado!",
                    description: `Aula ${result.isCompleted ? 'marcada como concluída' : 'desmarcada'}.`,
                });
                await refreshAppUser();
            } else {
                 toast({ variant: 'destructive', title: "Erro", description: result.error });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: "Erro", description: "Não foi possível atualizar seu progresso." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!course || !module || !lesson) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Conteúdo não encontrado</CardTitle>
                    <CardDescription>Não foi possível encontrar a aula solicitada. ID do Curso: {courseId || 'N/A'}, ID do Módulo: {moduleId || 'N/A'}, ID da Aula: {lessonId || 'N/A'}</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const embedUrl = lesson.videoUrl ? getYouTubeEmbedUrl(lesson.videoUrl) : '';
    const isCompleted = appUser?.courseProgress?.[courseId]?.completedLessons.includes(lessonId) ?? false;

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/courses" className="hover:underline">Cursos</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/dashboard/courses/${courseId}`} className="hover:underline">{course.title}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/dashboard/courses/${courseId}/module/${moduleId}`} className="hover:underline">{module.title}</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-foreground">{lesson.title}</span>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline">{lesson.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {embedUrl ? (
                                <div className="aspect-video bg-muted rounded-lg mb-6">
                                   <iframe
                                        className="w-full h-full rounded-lg"
                                        src={embedUrl}
                                        title="Vídeo da Aula"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            ) : (
                                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                                    <p className="text-muted-foreground">Não há vídeo para esta aula.</p>
                                </div>
                            )}

                            <Separator className="my-6" />

                            <div>
                                <h3 className="text-xl font-bold font-headline mb-2">Conteúdo da Aula</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {lesson.content || 'Nenhum conteúdo de texto disponível para esta aula.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Conclusão da Aula</CardTitle>
                            <CardDescription>Marque esta aula como concluída para registrar seu progresso.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={cn("rounded-lg p-4 flex items-center justify-between", isCompleted ? "bg-green-100 border-green-200 border" : "bg-muted")}>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className={cn("h-6 w-6", isCompleted ? "text-green-600" : "text-muted-foreground")} />
                                    <p className="font-medium">{isCompleted ? "Aula concluída!" : "Marcar como concluída"}</p>
                                </div>
                                <Button onClick={handleToggleCompletion} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isCompleted ? "Desmarcar" : "Concluir Aula"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Recursos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {lesson.resources && lesson.resources.length > 0 ? (
                                <ul className="space-y-2">
                                {lesson.resources.map((resource, index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4"/>
                                            <span>{resource.name}</span>
                                        </div>
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" size="icon"><Download /></Button>
                                        </a>
                                </li>
                                ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhum recurso para esta aula.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
