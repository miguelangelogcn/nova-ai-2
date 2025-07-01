import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const logs = [
    { timestamp: "2024-05-21 10:45:12", user: "Jane Doe", action: "Course Started", details: "Advanced Cardiac Life Support" },
    { timestamp: "2024-05-21 10:30:05", user: "John Smith", action: "Login", details: "Successful login" },
    { timestamp: "2024-05-21 10:15:34", user: "Admin", action: "User Added", details: "emily.j@hospital.com" },
    { timestamp: "2024-05-21 09:50:22", user: "Jane Doe", action: "AI Mentor Chat", details: "Asked about medication dosage." },
    { timestamp: "2024-05-20 18:00:00", user: "Jane Doe", action: "SWOT Updated", details: "Completed 'A Bússola' assessment." },
];

export default function AdminLogsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Activity Logs</CardTitle>
                <CardDescription>A record of all activities that have occurred on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
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
