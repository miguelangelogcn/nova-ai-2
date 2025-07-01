'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck, Edit, Lightbulb, Loader2, ShieldAlert, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import type { Assessment } from "@/services/user";

export default function ProfilePage() {
    const { user, appUser, loading } = useAuth();

    if (loading || !user || !appUser) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    const getAvatarFallback = () => {
        if (appUser?.displayName) {
            return appUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase();
        }
        if (user.email) {
            return user.email.substring(0, 2).toUpperCase();
        }
        return 'U';
    }

    const latestAssessment: Assessment | null = appUser.assessments && appUser.assessments.length > 0 ? appUser.assessments[0] : null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={appUser.photoURL ?? "https://placehold.co/80x80.png"} data-ai-hint="mulher sorrindo" alt={appUser.displayName} />
                            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold font-headline">{appUser.displayName}</h1>
                            <p className="text-muted-foreground capitalize">{appUser.role}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge>Cardiologia</Badge>
                                <Badge variant="secondary">{appUser.team ?? 'Equipe Alpha'}</Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="ml-auto"><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {latestAssessment ? (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline">Análise SWOT Mais Recente</CardTitle>
                            <CardDescription>Suas forças, fraquezas, oportunidades e ameaças profissionais, com base na sua última avaliação.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-card border">
                                <h3 className="font-headline text-xl flex items-center gap-3 mb-2 text-chart-2">
                                    <Lightbulb className="h-6 w-6" /> 
                                    Forças
                                </h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{latestAssessment.swot.strengths}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h3 className="font-headline text-xl flex items-center gap-3 mb-2 text-chart-4">
                                    <Target className="h-6 w-6" /> 
                                    Fraquezas
                                </h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{latestAssessment.swot.weaknesses}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h3 className="font-headline text-xl flex items-center gap-3 mb-2 text-primary">
                                    <TrendingUp className="h-6 w-6" /> 
                                    Oportunidades
                                </h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{latestAssessment.swot.opportunities}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-card border">
                                <h3 className="font-headline text-xl flex items-center gap-3 mb-2 text-destructive">
                                    <ShieldAlert className="h-6 w-6" /> 
                                    Ameaças
                                </h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{latestAssessment.swot.threats}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                             <Button asChild variant="outline">
                                <Link href="/questionnaire">Fazer Nova Avaliação</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2">
                            <ClipboardCheck className="text-accent" />
                            Sua Bússola
                            </CardTitle>
                            <CardDescription>Comece sua jornada completando a avaliação 'A Bússola' para gerar sua análise SWOT profissional.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground">Sua análise SWOT está aguardando.</p>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/questionnaire">Fazer Avaliação <ArrowRight className="ml-2" /></Link>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
