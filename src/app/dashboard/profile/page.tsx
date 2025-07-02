'use client';
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ClipboardCheck, Edit, Loader2, User as UserIcon, Calendar, Book, Phone, FileText } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import type { Assessment } from "@/services/user";
import { SwotCube } from "./swot-cube";
import { PersonalizedLearningPlan } from "../personalized-learning-plan";
import { EditProfileDialog } from "./edit-profile-dialog";

export default function ProfilePage() {
    const { user, appUser, loading } = useAuth();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
        <>
        <EditProfileDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-2">
                                <AvatarImage src={appUser.photoURL ?? "https://placehold.co/96x96.png"} data-ai-hint="mulher sorrindo" alt={appUser.displayName} />
                                <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="font-headline text-2xl">{appUser.displayName}</CardTitle>
                            <CardDescription className="capitalize">{appUser.role}</CardDescription>
                            {appUser.team && <Badge variant="secondary">{appUser.team}</Badge>}
                        </CardHeader>
                        <CardFooter>
                            <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader>
                           <CardTitle className="font-headline text-lg flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-accent"/>
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 text-muted-foreground">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-3"/>
                                <span>Idade: {appUser.age || 'Não informado'}</span>
                            </div>
                             <div className="flex items-center">
                                <Book className="h-4 w-4 mr-3"/>
                                <span>Escolaridade: {appUser.education || 'Não informado'}</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-3"/>
                                <span>Telefone: {appUser.phone || 'Não informado'}</span>
                            </div>
                             <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-3"/>
                                <span>CPF: {appUser.cpf || 'Não informado'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-6">
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
        </div>
        </>
    )
}
