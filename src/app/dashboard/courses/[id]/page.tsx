'use client';

import { getCourse, type Course } from "@/services/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
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
                    <CardTitle>Course not found</CardTitle>
                    <CardDescription>This course could not be found.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const modules = course.content?.modules || [];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{course.category}</Badge>
                    <CardTitle className="text-3xl font-headline">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="text-xl font-bold font-headline mb-4">Modules</h3>
                    {modules.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {modules.map((module) => (
                                <Link key={module.id} href={`/dashboard/courses/${id}/module/${module.id}`}>
                                    <Card className="hover:bg-muted/50 transition-colors h-full">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg"><BookOpen className="text-primary"/>{module.title}</CardTitle>
                                            <CardDescription>{module.description}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">No modules listed for this course yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
