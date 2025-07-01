import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const logs = [
    { timestamp: "2024-05-21 10:45:12", user: "Jane Doe", action: "Curso Iniciado", details: "Suporte Avançado de Vida em Cardiologia" },
    { timestamp: "2024-05-21 10:30:05", user: "John Smith", action: "Login", details: "Login bem-sucedido" },
    { timestamp: "2024-05-21 10:15:34", user: "Admin", action: "Usuário Adicionado", details: "emily.j@hospital.com" },
    { timestamp: "2024-05-21 09:50:22", user: "Jane Doe", action: "Chat com Mentor de IA", details: "Perguntou sobre dosagem de medicamento." },
    { timestamp: "2024-05-20 18:00:00", user: "Jane Doe", action: "SWOT Atualizada", details: "Concluiu a avaliação 'A Bússola'." },
];

export default function AdminLogsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Registros de Atividade</CardTitle>
                <CardDescription>Um registro de todas as atividades que ocorreram na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data e Hora</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Ação</TableHead>
                            <TableHead>Detalhes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell><Badge variant="outline">{log.action}</Badge></TableCell>
                                <TableCell>{log.details}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
