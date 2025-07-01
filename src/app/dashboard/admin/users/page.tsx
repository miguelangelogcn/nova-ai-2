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


export default async function AdminUsersPage() {
    let users: AppUser[] = [];
    let error: string | null = null;

    try {
        const fetchedUsers = await getUsersAction();
        // Sort users on the client-side to avoid complex Firestore indexing
        users = fetchedUsers.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } catch (e: any) {
        error = e.message;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Gerenciamento de Usuários</CardTitle>
                        <CardDescription>Visualize, adicione e gerencie todos os usuários da plataforma.</CardDescription>
                    </div>
                    <AddUserDialog />
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
                                    <TableHead>Status</TableHead>
                                    <TableHead>Data de Cadastro</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? users.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="font-medium">{user.displayName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="secondary" className="capitalize">{user.role}</Badge></TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'Ativo' ? 'default' : 'destructive'}>{user.status}</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">Nenhum usuário encontrado.</TableCell>
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