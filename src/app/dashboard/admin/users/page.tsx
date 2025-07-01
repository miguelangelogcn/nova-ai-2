import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, PlusCircle, Search } from "lucide-react";

const users = [
    { name: "John Smith", email: "john.smith@hospital.com", role: "Registered Nurse", team: "ICU", status: "Active" },
    { name: "Emily Johnson", email: "emily.j@hospital.com", role: "Nurse Technician", team: "Pediatrics", status: "Active" },
    { name: "Michael Williams", email: "michael.w@hospital.com", role: "Registered Nurse", team: "Emergency", status: "Inactive" },
    { name: "Jessica Brown", email: "jess.brown@hospital.com", role: "Registered Nurse", team: "ICU", status: "Active" },
    { name: "David Jones", email: "david.j@hospital.com", role: "Charge Nurse", team: "Cardiology", status: "Active" },
];

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">User Management</CardTitle>
                        <CardDescription>Manage your organization's users and teams.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><FileUp className="mr-2" /> Import</Button>
                        <Button><PlusCircle className="mr-2" /> Add User</Button>
                    </div>
                </div>
                <div className="relative mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="pl-8" />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
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
                                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-green-500' : ''}>{user.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
