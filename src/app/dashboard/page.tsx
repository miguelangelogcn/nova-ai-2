'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Bot, BookOpen, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { appUser } = useAuth();
    const displayName = appUser?.displayName?.split(' ')[0] ?? 'User';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Bem-vindo(a) de volta, {displayName}!</h1>
                <p className="text-muted-foreground">Aqui está o resumo do seu progresso. Continue com o ótimo trabalho!</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                           <ClipboardCheck className="text-accent" />
                           Sua Bússola
                        </CardTitle>
                        <CardDescription>Comece sua jornada completando a avaliação 'A Bússola' para desbloquear seu plano de aprendizado personalizado.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">Sua análise SWOT e recomendações de cursos estão aguardando.</p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/questionnaire">Fazer Avaliação <ArrowRight className="ml-2" /></Link>
                        </Button>
                    </CardFooter>
                </Card>

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
