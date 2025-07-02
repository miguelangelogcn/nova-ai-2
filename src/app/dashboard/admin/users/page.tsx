import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getUsersAction } from "./actions";
import type { AppUser } from "@/services/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AddUserDialog } from "./add-user-dialog";
import { getTeamsAction } from "../teams/actions";
import type { Team } from "@/services/teams";
import { UserActions } from "./user-actions";
import type { Cargo } from "@/services/cargos";
import { getCargosAction } from "../cargos/actions";


export default async function AdminUsersPage() {
    let users: AppUser[] = [];
    let teams: Team[] = [];
    let cargos: Cargo[] = [];
    let error: string | null = null;

    try {
        const [fetchedUsers, fetchedTeams, fetchedCargos] = await Promise.all([
            getUsersAction(),
            getTeamsAction(),
            getCargosAction(),
        ]);
        users = fetchedUsers;
        teams = fetchedTeams;
        cargos = fetchedCargos;
    } catch (e: any) {
        error = e.message;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Gerenciamento de Usuários</CardTitle>
                        <CardDescription>Visualize, adicione, edite e gerencie todos os usuários da plataforma.</CardDescription>
                    </div>
                    <AddUserDialog availableTeams={teams} availableCargos={cargos} />
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro ao Carregar Usuários</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Equipe</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data de Cadastro</TableHead>
                                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? users.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="font-medium">{user.displayName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="secondary" className="capitalize">{user.role.replace(/-/g, ' ')}</Badge></TableCell>
                                        <TableCell>{user.cargo || 'N/A'}</TableCell>
                                        <TableCell>{user.team || 'N/A'}</TableCell>
                                        <TableCell>{user.phone || 'N/A'}</TableCell>
                                        <TableCell>{user.cpf || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'Ativo' ? 'default' : 'destructive'}>{user.status}</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                                        <TableCell className="text-right">
                                            <UserActions user={user} availableTeams={teams} availableCargos={cargos} />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center h-24">Nenhum usuário encontrado.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
