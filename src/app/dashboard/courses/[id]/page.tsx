'use client';

import { getCourse, type Course } from "@/services/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CourseModulesPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
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

    if (loading) {
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

    const modules = course.modules || [];

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
