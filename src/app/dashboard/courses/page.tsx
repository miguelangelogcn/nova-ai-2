'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses, type Course } from "@/services/courses";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const fetchedCourses = await getCourses();
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Course Library</h1>
                <p className="text-muted-foreground">Expand your knowledge and skills with our comprehensive list of courses.</p>
            </div>
            {courses.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No Courses Available</CardTitle>
                        <CardDescription>It looks like there are no courses here yet. Please check back later or contact an administrator.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Link href={`/dashboard/courses/${course.id}`} key={course.id}>
                            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="p-0">
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={course.image || 'https://placehold.co/600x400.png'}
                                            alt={course.title}
                                            fill
                                            className="rounded-t-lg object-cover"
                                            data-ai-hint={course.dataAiHint}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-4 space-y-2">
                                    <Badge variant="secondary">{course.category}</Badge>
                                    <CardTitle className="font-headline text-lg">{course.title}</CardTitle>
                                    <CardDescription className="text-sm">{course.description}</CardDescription>
                                </CardContent>
                                <CardFooter className="p-4">
                                     <p className="text-xs text-primary font-semibold">View Details</p>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
