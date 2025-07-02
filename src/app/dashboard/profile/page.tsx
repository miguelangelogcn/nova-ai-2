'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, ClipboardCheck, Edit, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import type { Assessment } from "@/services/user";
import { SwotCube } from "./swot-cube";
import { PersonalizedLearningPlan } from "../personalized-learning-plan";

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
                                {appUser.team && <Badge variant="secondary">{appUser.team}</Badge>}
                            </div>
                        </div>
                        <Button variant="outline" className="ml-auto"><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-1 gap-6">
                {latestAssessment && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Análise Swot Pessoal</CardTitle>
                            <CardDescription>Sua análise mais recente. Gire o cubo para explorar suas forças, fraquezas, oportunidades e ameaças.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SwotCube swot={latestAssessment.swot} />
                        </CardContent>
                    </Card>
                )}
                 {latestAssessment?.learningPath && (
                    <PersonalizedLearningPlan learningPath={latestAssessment.learningPath} />
                 )}
            </div>
        </div>
    )
}
