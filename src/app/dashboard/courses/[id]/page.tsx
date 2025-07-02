'use client';

import { getCourse, type Course } from "@/services/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, BookOpen, ChevronRight, FileText, Play } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { startCourseAction } from "@/services/progress";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function CourseModulesPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const { user, appUser, refreshAppUser, loading: authLoading } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const fetchedCourse = await getCourse(id);
                setCourse(fetchedCourse);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);
    
    const handleStartCourse = async () => {
        if (!user || !id) return;
        setIsStarting(true);
        try {
            const result = await startCourseAction(user.uid, id);
            if (result.success) {
                await refreshAppUser();
                toast({
                    title: "Curso iniciado!",
                    description: "Você já pode começar a aprender.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: result.error || "Não foi possível iniciar o curso.",
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: error.message || "Ocorreu um erro ao tentar iniciar o curso.",
            });
        } finally {
            setIsStarting(false);
        }
    };


    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Curso não encontrado</CardTitle>
                    <CardDescription>Este curso não pôde ser encontrado. Tentamos buscar um curso com o ID: {id || "Não disponível"}</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const isCourseStarted = !!appUser?.courseProgress?.[id];
    const modules = course.modules || [];
    
    // PROGRESS VIEW - User has started the course
    if (isCourseStarted) {
        const completedLessons = appUser?.courseProgress?.[id]?.completedLessons.length || 0;
        const totalLessons = modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0);
        const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/dashboard/courses" className="hover:underline">Cursos</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-semibold text-foreground">{course.title}</span>
                </div>
                <Card>
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">{course.category}</Badge>
                        <CardTitle className="text-3xl font-headline">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {totalLessons > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-bold font-headline mb-2">Seu Progresso</h3>
                                <div className="flex items-center gap-4">
                                    <Progress value={progressPercentage} className="flex-1"/>
                                    <span className="text-sm font-medium text-muted-foreground">{completedLessons} de {totalLessons} aulas</span>
                                </div>
                            </div>
                        )}
                        <h3 className="text-xl font-bold font-headline mb-4">Módulos</h3>
                        {modules.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {modules.map((module) => (
                                    <Link key={module.id} href={`/dashboard/courses/${id}/module/${module.id}`}>
                                        <Card className="hover:bg-muted/50 transition-colors h-full">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="text-accent"/>{module.title}</CardTitle>
                                                <CardDescription>{module.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Ainda não há módulos listados para este curso.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // PREVIEW VIEW - User has NOT started the course
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/courses" className="hover:underline">Cursos</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-semibold text-foreground">{course.title}</span>
            </div>
            <Card>
                <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{course.category}</Badge>
                    <CardTitle className="text-3xl font-headline">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="text-xl font-bold font-headline mb-4 border-b pb-2">Conteúdo Programático</h3>
                    <div className="space-y-4">
                        {modules.length > 0 ? (
                            modules.map((module) => (
                                <div key={module.id} className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-bold flex items-center gap-2 mb-3 text-base">
                                        <BookOpen className="h-5 w-5 text-accent"/> 
                                        {module.title}
                                    </h4>
                                    <ul className="space-y-2 pl-7">
                                        {module.lessons && module.lessons.length > 0 ? module.lessons.map(lesson => (
                                            <li key={lesson.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <FileText className="h-4 w-4" />
                                                <span>{lesson.title}</span>
                                            </li>
                                        )) : (
                                            <li className="flex items-center gap-2 text-sm text-muted-foreground/70 italic">
                                                <span>Nenhuma aula neste módulo.</span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">O conteúdo programático deste curso ainda não está disponível.</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full" onClick={handleStartCourse} disabled={isStarting}>
                        {isStarting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando...
                            </>
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" />
                                Iniciar Curso
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
