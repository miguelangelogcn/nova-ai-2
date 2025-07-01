import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Gerenciamento de Usuários</CardTitle>
                <CardDescription>Adicione, remova e edite os perfis dos membros da sua equipe.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold text-muted-foreground">Em breve</h3>
                    <p className="text-muted-foreground">A funcionalidade de gerenciamento de usuários está em desenvolvimento.</p>
                </div>
            </CardContent>
        </Card>
    )
}
