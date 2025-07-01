'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileUp, MoreHorizontal, PlusCircle, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppUser } from "@/services/user";
import { getUsersAction } from "./actions";
import { UserFormDialog, DeleteUserDialog } from "./components";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogState, setDialogState] = useState<{
        isUserFormOpen: boolean;
        isDeleteConfirmOpen: boolean;
        selectedUser: AppUser | null;
    }>({
        isUserFormOpen: false,
        isDeleteConfirmOpen: false,
        selectedUser: null,
    });
    const { toast } = useToast();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const userList = await getUsersAction();
            setUsers(userList);
        } catch (error: any) {
            console.error("Failed to fetch users:", error);
            toast({
                variant: 'destructive',
                title: 'Erro ao Carregar Usuários',
                description: error.message || "Não foi possível buscar a lista de usuários. Verifique a configuração do Firebase Admin e as credenciais.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const openDialog = (type: 'userForm' | 'deleteConfirm', user: AppUser | null = null) => {
        setDialogState(prev => ({ ...prev, selectedUser: user, [type === 'userForm' ? 'isUserFormOpen' : 'isDeleteConfirmOpen']: true }));
    }

    const closeDialog = () => {
        setDialogState({ isUserFormOpen: false, isDeleteConfirmOpen: false, selectedUser: null });
    }

    const filteredUsers = users.filter(user =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Gerenciamento de Usuários</CardTitle>
                            <CardDescription>Gerencie os usuários e equipes da sua organização.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline"><FileUp className="mr-2" /> Importar</Button>
                            <Button onClick={() => openDialog('userForm')}><PlusCircle className="mr-2" /> Adicionar Usuário</Button>
                        </div>
                    </div>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar usuários..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Equipe</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Ações</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                 <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Nenhum usuário encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map(user => (
                                    <TableRow key={user.uid}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.photoURL || "https://placehold.co/40x40.png"} data-ai-hint="person portrait" />
                                                    <AvatarFallback>{user.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.displayName}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="capitalize">{user.role}</TableCell>
                                        <TableCell><Badge variant="secondary">{user.team || 'N/A'}</Badge></TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === 'Ativo' ? 'default' : 'destructive'} className={user.status === 'Ativo' ? 'bg-green-500' : ''}>{user.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openDialog('userForm', user)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openDialog('deleteConfirm', user)} className="text-destructive">Remover</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <UserFormDialog
                open={dialogState.isUserFormOpen}
                onOpenChange={closeDialog}
                user={dialogState.selectedUser}
                onSave={() => {
                    closeDialog();
                    fetchUsers();
                }}
            />

            <DeleteUserDialog
                open={dialogState.isDeleteConfirmOpen}
                onOpenChange={closeDialog}
                user={dialogState.selectedUser}
                onDelete={() => {
                    closeDialog();
                    fetchUsers();
                }}
            />
        </>
    )
}
