'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses, type Course } from "@/services/courses";
import type { LearningPath } from "@/services/user";
import { Loader2, BookCheck } from "lucide-react";
import Link from "next/link";

interface PersonalizedLearningPlanProps {
    learningPath?: LearningPath;
}

export function PersonalizedLearningPlan({ learningPath }: PersonalizedLearningPlanProps) {
    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndSortCourses = async () => {
            if (!learningPath?.recommendedCourseIds || learningPath.recommendedCourseIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const allCourses = await getCourses();
                const recommendedMap = new Map(allCourses.map(course => [course.id, course]));
                
                const sortedCourses = learningPath.recommendedCourseIds
                    .map(id => recommendedMap.get(id))
                    .filter((course): course is Course => !!course);

                setRecommendedCourses(sortedCourses);
            } catch (error) {
                console.error("Failed to fetch recommended courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndSortCourses();
    }, [learningPath]);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <BookCheck className="text-accent" />
                    Trilha de Aprendizagem Personalizada
                </CardTitle>
                <CardDescription>
                    Cursos recomendados pela IA com base na sua análise SWOT para impulsionar seu desenvolvimento.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow min-h-[100px]">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : recommendedCourses.length > 0 ? (
                    <ol className="space-y-3 list-decimal list-inside">
                        {recommendedCourses.map((course) => (
                           <li key={course.id} className="font-medium text-primary hover:underline">
                               <Link href={`/dashboard/courses/${course.id}`}>
                                  {course.title}
                               </Link>
                           </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {learningPath?.reasoning || "Nenhuma recomendação de curso disponível no momento. Explore nossa biblioteca de cursos."}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
