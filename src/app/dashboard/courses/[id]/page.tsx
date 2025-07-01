'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Loader2, MessageCircle, PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCourse, type Course } from "@/services/courses";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const fetchedCourse = await getCourse(id as string);
                setCourse(fetchedCourse);
            } catch (error) {
                console.error("Failed to fetch course:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchCourse();
        }
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
                    <CardDescription>This course could not be found. It may have been removed or the link is incorrect.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit">{course.category}</Badge>
                        <CardTitle className="text-3xl font-headline mt-2">{course.title}</CardTitle>
                        <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                           <p className="text-muted-foreground">Video player placeholder</p>
                        </div>
                        <Separator className="my-6" />
                        <h3 className="text-xl font-bold font-headline mb-2">About this course</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {course.content?.about ?? 'Details about this course are not available yet.'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><MessageCircle /> Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Comments feature coming soon.</p>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Course Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(course.content?.modules && course.content.modules.length > 0) ? (
                            <Accordion type="single" collapsible className="w-full">
                                {course.content.modules.map((moduleWrapper, index) => {
                                    const module = Object.values(moduleWrapper)[0];
                                    if (!module) return null;

                                    return (
                                        <AccordionItem value={`item-${index}`} key={index}>
                                            <AccordionTrigger className="font-semibold">{module.title}</AccordionTrigger>
                                            <AccordionContent>
                                                {module.description && <p className="text-sm text-muted-foreground pb-4">{module.description}</p>}
                                                <ul className="space-y-3 pl-2">
                                                    {module.lessons.map((lessonWrapper, lessonIndex) => {
                                                        const lesson = Object.values(lessonWrapper)[0];
                                                        if (!lesson) return null;
                                                        return (
                                                            <li key={lessonIndex} className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
                                                                <PlayCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                <span className="flex-1">{lesson.title}</span>
                                                            </li>
                                                        )
                                                    })}
                                                    {module.lessons.length === 0 && (
                                                        <li className="text-sm text-muted-foreground pl-2">Nenhuma aula neste módulo ainda.</li>
                                                    )}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum módulo listado para este curso.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-2">
                           <li className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText />
                                    <span>Course Materials PDF</span>
                                </div>
                                <Button variant="ghost" size="icon"><Download /></Button>
                           </li>
                         </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
