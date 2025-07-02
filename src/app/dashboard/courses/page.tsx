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
import { Loader2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
    const [startedCourses, setStartedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { appUser } = useAuth();

    useEffect(() => {
        const fetchCoursesAndRecommendations = async () => {
            setLoading(true);
            try {
                const fetchedCourses = await getCourses();
                setCourses(fetchedCourses);

                if (appUser) {
                    // Recommended Courses
                    const latestAssessment = appUser.assessments?.[0];
                    const recommendedIds = latestAssessment?.learningPath?.recommendedCourseIds;
                    
                    if (recommendedIds && recommendedIds.length > 0) {
                        const recommendedMap = new Map(fetchedCourses.map(course => [course.id, course]));
                        const sortedCourses = recommendedIds
                            .map(id => recommendedMap.get(id))
                            .filter((course): course is Course => !!course);
                        setRecommendedCourses(sortedCourses);
                    } else {
                        setRecommendedCourses([]);
                    }

                    // Started Courses
                    const inProgressCourses = fetchedCourses.filter(
                        course => appUser.courseProgress?.[course.id] && !appUser.courseProgress[course.id].completedAt
                    );
                    setStartedCourses(inProgressCourses);

                } else {
                    setRecommendedCourses([]);
                    setStartedCourses([]);
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

    const CourseCard = ({ course, isRecommended = false }: { course: Course, isRecommended?: boolean }) => {
        const courseProgress = appUser?.courseProgress?.[course.id];
        const isStarted = !!courseProgress;
        const isCompleted = !!courseProgress?.completedAt;

        const totalLessons = course.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
        const completedLessons = courseProgress?.completedLessons?.length || 0;
        const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        return (
            <Link href={`/dashboard/courses/${course.id}`} className="h-full block">
                <Card className={cn(
                    "flex flex-col h-full hover:shadow-lg transition-shadow duration-300",
                    isRecommended && "bg-gradient-to-br from-accent/20"
                )}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <Badge variant="secondary" className="w-fit mb-2">{course.category}</Badge>
                            {isCompleted && <Badge variant="default" className="bg-green-600 hover:bg-green-700">Concluído</Badge>}
                        </div>
                        <CardTitle className="font-headline text-lg">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription className="text-sm line-clamp-3">{course.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-2">
                         {isStarted && !isCompleted && totalLessons > 0 && (
                             <div className="w-full space-y-1">
                                 <Progress value={progressPercentage} className="h-2" />
                                 <p className="text-xs text-muted-foreground">{completedLessons} de {totalLessons} aulas</p>
                             </div>
                         )}
                         <p className="text-xs text-primary font-semibold pt-2">
                           {isStarted && !isCompleted ? 'Continuar Curso' : (isCompleted ? 'Revisar Curso' : 'Ver Detalhes')}
                         </p>
                    </CardFooter>
                </Card>
            </Link>
        );
    };

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

            {startedCourses.length > 0 && (
                 <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
                            <PlayCircle className="text-primary" />
                            Cursos Iniciados
                        </h2>
                        <p className="text-muted-foreground">Continue de onde você parou.</p>
                    </div>
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full px-12"
                    >
                        <CarouselContent>
                            {startedCourses.map((course) => (
                                <CarouselItem key={course.id} className="md:basis-1/2 lg:basis-1/3">
                                   <div className="p-1 h-full">
                                     <CourseCard course={course} />
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
