'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, BookOpen, BarChart, Users, ClipboardList, Users2, TrendingUp, ListChecks } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { getCourses, type Course } from "@/services/courses";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { appUser } = useAuth();
    const displayName = appUser?.displayName?.split(' ')[0] ?? 'Usuário';

    // State for courses and recommended courses
    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const fetchedCourses = await getCourses();
                setCourses(fetchedCourses);
            } catch (error) {
                console.error("Failed to fetch courses for dashboard:", error);
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchAllCourses();
    }, []);

    const latestAssessment = appUser?.assessments?.[0];
    const recommendedIds = latestAssessment?.learningPath ?? [];
    
    const recommendedCourses = courses
        .filter(course => recommendedIds.includes(course.id))
        // Ensure the order from the learning path is respected
        .sort((a, b) => recommendedIds.indexOf(a.id) - recommendedIds.indexOf(b.id));


    // Admin Dashboard View
    if (appUser?.role === 'admin') {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Painel do Administrador</h1>
                    <p className="text-muted-foreground">Gerencie sua organização e monitore o progresso do aprendizado.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                               <Users className="text-accent" />
                               Gerenciamento de Usuários
                            </CardTitle>
                            <CardDescription>Adicione, remova e edite os perfis dos membros da sua equipe.</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Button asChild className="w-full">
                                <Link href="/dashboard/admin/users">Gerenciar Usuários <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                               <Users2 className="text-accent" />
                               Gerenciamento de Equipes
                            </CardTitle>
                            <CardDescription>Crie, edite e organize as equipes da sua organização.</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Button asChild className="w-full">
                                <Link href="/dashboard/admin/teams">Gerenciar Equipes <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                               <BarChart className="text-accent" />
                               Relatórios e Análises
                            </CardTitle>
                            <CardDescription>Veja as métricas de conclusão de cursos e engajamento da equipe.</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Button asChild className="w-full">
                                <Link href="/dashboard/admin/dashboard">Ver Relatórios <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                               <ClipboardList className="text-accent" />
                               Registros de Atividade
                            </CardTitle>
                            <CardDescription>Monitore todas as atividades importantes que ocorrem na plataforma.</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Button asChild className="w-full">
                                <Link href="/dashboard/admin/logs">Ver Registros <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )
    }

    // Default User (Nurse/Technician) Dashboard View
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Bem-vindo(a) de volta, {displayName}!</h1>
                <p className="text-muted-foreground">Aqui está o resumo do seu progresso. Continue com o ótimo trabalho!</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Bot className="text-accent" />
                            Mentor de IA
                        </CardTitle>
                        <CardDescription>Tem uma pergunta? Seu Mentor de IA está disponível 24/7 para ajudar com qualquer dúvida clínica ou de procedimento.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm bg-muted p-3 rounded-lg">"Quais são os 5 certos da administração de medicamentos?"</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/mentor">Conversar Agora <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <TrendingUp className="text-accent" />
                            Trilha de Aprendizado Personalizada
                        </CardTitle>
                        <CardDescription>
                            {loadingCourses ? "Analisando seu perfil para sugerir os melhores cursos..."
                                : recommendedCourses.length > 0
                                ? "Cursos recomendados pela IA com base na sua última análise."
                                : "Sua trilha de aprendizado aparecerá aqui após sua análise."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        {loadingCourses ? (
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-3/4" />
                            </div>
                        ) : recommendedCourses.length > 0 ? (
                            recommendedCourses.map((course, index) => (
                                <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="block">
                                    <div className="flex items-center gap-3 p-2 rounded-md border hover:bg-muted/50 transition-colors">
                                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">{index + 1}</span>
                                        <span className="font-medium flex-1 truncate">{course.title}</span>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center text-sm text-muted-foreground py-4 flex flex-col items-center justify-center h-full">
                                <ListChecks className="w-10 h-10 mb-2 text-muted-foreground/50"/>
                                <p className="font-semibold">Nenhum curso recomendado por enquanto.</p>
                                <p>Após sua próxima avaliação, nossa IA montará uma trilha aqui.</p>
                            </div>
                        )}
                    </CardContent>
                     <CardFooter>
                         <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/courses">Explorar Todos os Cursos <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
