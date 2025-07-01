'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, BookOpen, ClipboardCheck, BarChart, Users, ClipboardList, Users2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { appUser } = useAuth();
    const displayName = appUser?.displayName?.split(' ')[0] ?? 'Usuário';

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
                            <BookOpen className="text-accent" />
                            Plano de Aprendizagem
                        </CardTitle>
                        <CardDescription>Explore cursos feitos para você. Aqui está o seu progresso atual.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div>
                            <div className="flex justify-between mb-1 text-sm">
                                <span>Progresso Geral</span>
                                <span>35%</span>
                            </div>
                            <Progress value={35} />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="secondary" className="w-full">
                            <Link href="/dashboard/courses">Explorar Cursos <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
