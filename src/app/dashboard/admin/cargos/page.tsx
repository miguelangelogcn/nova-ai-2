import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCargosAction } from "./actions";
import type { Cargo } from "@/services/cargos";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AddCargoDialog } from "./add-cargo-dialog";
import { CargoActions } from "./cargo-actions";

export default async function AdminCargosPage() {
    let cargos: Cargo[] = [];
    let error: string | null = null;

    try {
        cargos = await getCargosAction();
    } catch (e: any) {
        error = e.message;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline">Gerenciamento de Cargos</CardTitle>
                        <CardDescription>Visualize, adicione e gerencie todos os cargos da plataforma.</CardDescription>
                    </div>
                    <AddCargoDialog />
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro ao Carregar Cargos</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Data de Criação</TableHead>
                                    <TableHead className="text-right w-[80px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cargos.length > 0 ? cargos.map((cargo) => (
                                    <TableRow key={cargo.id}>
                                        <TableCell className="font-medium">{cargo.name}</TableCell>
                                        <TableCell>{format(new Date(cargo.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                                        <TableCell className="text-right">
                                            <CargoActions cargo={cargo} />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">Nenhum cargo encontrado.</TableCell>
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
