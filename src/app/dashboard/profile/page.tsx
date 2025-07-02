'use client';
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Edit, Loader2, User as UserIcon, Calendar, Book, Phone, FileText, Briefcase } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import type { Assessment } from "@/services/user";
import { SwotCube } from "./swot-cube";
import { PersonalizedLearningPlan } from "../personalized-learning-plan";
import { EditProfileDialog } from "./edit-profile-dialog";
import { AvatarUpload } from "./avatar-upload";

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
    
    const latestAssessment: Assessment | null = appUser.assessments && appUser.assessments.length > 0 ? appUser.assessments[0] : null;

    return (
        <>
        <EditProfileDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <AvatarUpload />
                            <CardTitle className="font-headline text-2xl mt-2">{appUser.displayName}</CardTitle>
                            <CardDescription className="capitalize">{appUser.cargo || 'Cargo não informado'}</CardDescription>
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
                                <Briefcase className="h-4 w-4 mr-3"/>
                                <span>Cargo: {appUser.cargo || 'Não informado'}</span>
                            </div>
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
