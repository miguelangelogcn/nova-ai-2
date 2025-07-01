'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { getCourses, type Course } from "@/services/courses";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { appUser } = useAuth();

    useEffect(() => {
        const fetchCoursesAndRecommendations = async () => {
            setLoading(true);
            try {
                const fetchedCourses = await getCourses();
                setCourses(fetchedCourses);

                if (appUser) {
                    const latestAssessment = appUser.assessments?.[0];
                    const recommendedIds = latestAssessment?.learningPath?.recommendedCourseIds;
                    
                    if (recommendedIds && recommendedIds.length > 0) {
                        const recommendedMap = new Map(fetchedCourses.map(course => [course.id, course]));
                        const sortedCourses = recommendedIds
                            .map(id => recommendedMap.get(id))
                            .filter((course): course is Course => !!course);
                        setRecommendedCourses(sortedCourses);
                    } else {
                        setRecommendedCourses([]); // Limpa as recomendações se o usuário não tiver uma trilha
                    }
                } else {
                    setRecommendedCourses([]); // Limpa as recomendações se não houver usuário
                }
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoursesAndRecommendations();
    }, [appUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const CourseCard = ({ course, isRecommended = false }: { course: Course, isRecommended?: boolean }) => (
        <Link href={`/dashboard/courses/${course.id}`} className="h-full block">
            <Card className={cn(
                "flex flex-col h-full hover:shadow-lg transition-shadow duration-300",
                isRecommended && "bg-gradient-to-br from-accent/20"
            )}>
                <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{course.category}</Badge>
                    <CardTitle className="font-headline text-lg">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription className="text-sm">{course.description}</CardDescription>
                </CardContent>
                <CardFooter>
                     <p className="text-xs text-primary font-semibold">Ver Detalhes</p>
                </CardFooter>
            </Card>
        </Link>
    );

    return (
        <div className="space-y-8">
            {recommendedCourses.length > 0 && (
                 <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold font-headline">Sua Trilha Personalizada</h2>
                        <p className="text-muted-foreground">Cursos selecionados pela IA para impulsionar seu desenvolvimento.</p>
                    </div>
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full px-12"
                    >
                        <CarouselContent>
                            {recommendedCourses.map((course) => (
                                <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3">
                                   <div className="p-1 h-full">
                                     <CourseCard course={course} isRecommended />
                                   </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                    <Separator />
                </div>
            )}

            <div>
                <h1 className="text-3xl font-bold font-headline">Biblioteca de Cursos</h1>
                <p className="text-muted-foreground">Expanda seu conhecimento e habilidades com nossa lista completa de cursos.</p>
            </div>
            {courses.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Nenhum Curso Disponível</CardTitle>
                        <CardDescription>Parece que ainda não há cursos aqui. Por favor, volte mais tarde ou contate um administrador.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseCard course={course} key={course.id} />
                    ))}
                </div>
            )}
        </div>
    )
}
