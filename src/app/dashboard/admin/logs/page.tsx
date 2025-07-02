import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLogsAction } from "./actions";
import type { Log } from "@/services/logs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function AdminLogsPage() {
    let logs: Log[] = [];
    let error: string | null = null;

    try {
        logs = await getLogsAction();
    } catch (e: any) {
        error = e.message;
    }

    const formatDetails = (details: Record<string, any>) => {
        if (!details || Object.keys(details).length === 0) {
            return 'N/A';
        }
        return Object.entries(details)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Registros de Atividade</CardTitle>
                <CardDescription>Um registro de todas as atividades que ocorreram na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
                {error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erro ao Carregar Registros</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
                    </Alert>
                ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data e Hora</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Ação</TableHead>
                                <TableHead>Detalhes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {logs.length > 0 ? logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs">{format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</TableCell>
                                    <TableCell>{log.actorName}</TableCell>
                                    <TableCell><Badge variant="outline" className="capitalize">{log.actorRole.replace(/-/g, ' ')}</Badge></TableCell>
                                    <TableCell><Badge variant="secondary">{log.action}</Badge></TableCell>
                                    <TableCell className="text-xs">{formatDetails(log.details)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">Nenhum registro encontrado.</TableCell>
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
