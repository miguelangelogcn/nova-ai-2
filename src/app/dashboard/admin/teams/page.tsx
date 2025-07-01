import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTeamsAction } from "./actions";
import type { Team } from "@/services/teams";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AddTeamDialog } from "./add-team-dialog";
import { TeamActions } from "./team-actions";

export default async function AdminTeamsPage() {
    let teams: Team[] = [];
    let error: string | null = null;

    try {
        teams = await getTeamsAction();
    } catch (e: any) {
        error = e.message;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Gerenciamento de Equipes</CardTitle>
                        <CardDescription>Visualize, adicione e gerencie todas as equipes da plataforma.</CardDescription>
                    </div>
                    <AddTeamDialog />
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro ao Carregar Equipes</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Data de Criação</TableHead>
                                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teams.length > 0 ? teams.map((team) => (
                                    <TableRow key={team.id}>
                                        <TableCell className="font-medium">{team.name}</TableCell>
                                        <TableCell>{team.description || 'N/A'}</TableCell>
                                        <TableCell>{format(new Date(team.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                                        <TableCell className="text-right">
                                            <TeamActions team={team} />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">Nenhuma equipe encontrada.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
