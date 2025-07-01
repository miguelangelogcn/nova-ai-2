'use client';

import { getCourse, type Course } from "@/services/courses";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronRight, FileText, Download } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function LessonContentPage() {
    const params = useParams<{ id: string, moduleId: string, lessonId: string }>();
    const courseId = params?.id;
    const moduleId = params?.moduleId;
    const lessonId = params?.lessonId;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            try {
                const fetchedCourse = await getCourse(courseId);
                setCourse(fetchedCourse);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    if (!course || !moduleId || !lessonId || !course.content?.modules[Number(moduleId)]) {
        return (
            <Card>
                <CardHeader><CardTitle>Content not found</CardTitle></CardHeader>
            </Card>
        );
    }
    
    const moduleWrapper = course.content.modules[Number(moduleId)];
    const module = Object.values(moduleWrapper)[0];
    
    if(!module || !module.lessons[Number(lessonId)]) {
         return (
            <Card>
                <CardHeader><CardTitle>Lesson not found</CardTitle></CardHeader>
            </Card>
        );
    }

    const lessonWrapper = module.lessons[Number(lessonId)];
    const lesson = Object.values(lessonWrapper)[0];

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/dashboard/courses" className="hover:underline">Courses</Link>
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
                             {lesson.videoUrl ? (
                                <div className="aspect-video bg-muted rounded-lg mb-6">
                                   <iframe
                                        className="w-full h-full rounded-lg"
                                        src={lesson.videoUrl}
                                        title="Lesson Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen>
                                    </iframe>
                                </div>
                            ) : (
                                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                                    <p className="text-muted-foreground">No video for this lesson.</p>
                                </div>
                            )}

                            <Separator className="my-6" />

                            <div>
                                <h3 className="text-xl font-bold font-headline mb-2">Lesson Content</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {lesson.content || 'No text content available for this lesson.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Resources</CardTitle>
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
                                <p className="text-sm text-muted-foreground">No resources for this lesson.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
