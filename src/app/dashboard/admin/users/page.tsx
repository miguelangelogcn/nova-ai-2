import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, PlusCircle, Search } from "lucide-react";

const users = [
    { name: "John Smith", email: "john.smith@hospital.com", role: "Enfermeiro(a) Registrado(a)", team: "UTI", status: "Ativo" },
    { name: "Emily Johnson", email: "emily.j@hospital.com", role: "Técnico(a) de Enfermagem", team: "Pediatria", status: "Ativo" },
    { name: "Michael Williams", email: "michael.w@hospital.com", role: "Enfermeiro(a) Registrado(a)", team: "Emergência", status: "Inativo" },
    { name: "Jessica Brown", email: "jess.brown@hospital.com", role: "Enfermeiro(a) Registrado(a)", team: "UTI", status: "Ativo" },
    { name: "David Jones", email: "david.j@hospital.com", role: "Enfermeiro(a) Chefe", team: "Cardiologia", status: "Ativo" },
];

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Gerenciamento de Usuários</CardTitle>
                        <CardDescription>Gerencie os usuários e equipes da sua organização.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><FileUp className="mr-2" /> Importar</Button>
                        <Button><PlusCircle className="mr-2" /> Adicionar Usuário</Button>
                    </div>
                </div>
                <div className="relative mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar usuários..." className="pl-8" />
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
                            <TableHead>Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person portrait" />
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell><Badge variant="secondary">{user.team}</Badge></TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'Ativo' ? 'default' : 'destructive'} className={user.status === 'Ativo' ? 'bg-green-500' : ''}>{user.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
