'use client';
import { getLogs } from "@/services/logs";
import { getAllUsers } from "@/services/user.admin";
import type { AppUser } from "@/services/user";
import { AccessChart } from "./access-chart";
import { HourlyAccessChart } from "./hourly-access-chart";
import { UserSelect } from "./user-select";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { type DateRange } from "react-day-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Helper function to process logs into monthly data
async function getAccessData(logs: any[]) {
  const employeeLogins = logs.filter(
    (log) => log.action === "USER_LOGIN" && log.actorRole === "desenvolvimento-funcionario"
  );

  const monthlyData: { [key: string]: { date: Date; desktop: number; mobile: number } } = {};

  employeeLogins.forEach((log) => {
    const date = new Date(log.timestamp);
    date.setDate(1); // Normalize to the first day of the month
    date.setHours(0, 0, 0, 0); // Normalize time to avoid timezone issues
    const key = date.toISOString();

    if (!monthlyData[key]) {
      monthlyData[key] = { date, desktop: 0, mobile: 0 };
    }

    // Since we don't have device info, we'll simulate it for demonstration.
    if (Math.random() > 0.4) {
      monthlyData[key].desktop += 1;
    } else {
      monthlyData[key].mobile += 1;
    }
  });

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(item => {
        const monthName = item.date.toLocaleString("pt-BR", { month: "long" });
        return {
            month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            desktop: item.desktop,
            mobile: item.mobile,
        }
    });
    
    return chartData;
}

// New helper function to process logs into hourly data
async function getHourlyAccessData(logs: any[]) {
    const employeeLogins = logs.filter(
        (log) => log.action === "USER_LOGIN" && log.actorRole === "desenvolvimento-funcionario"
    );

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, '0')}H`,
        desktop: 0,
        mobile: 0,
    }));
    
    employeeLogins.forEach((log) => {
        const date = new Date(log.timestamp);
        const hour = date.getHours();

        if (Math.random() > 0.4) {
            hourlyData[hour].desktop += 1;
        } else {
            hourlyData[hour].mobile += 1;
        }
    });

    return hourlyData;
}


export default function AdminDashboardPage() {
    const [allLogs, setAllLogs] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessData, setAccessData] = useState<any[]>([]);
    const [hourlyAccessData, setHourlyAccessData] = useState<any[]>([]);
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    // Fetch all logs and users once on mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const [logs, users] = await Promise.all([
                getLogs(),
                getAllUsers(),
            ]);
            setAllLogs(logs);
            setAllUsers(users.filter(u => u.role === 'desenvolvimento-funcionario'));
            setLoading(false);
        }
        fetchData();
    }, []);

    // Re-process data when logs, date range or user change
    useEffect(() => {
        if (loading) return; // Wait for initial fetch

        const filteredLogs = allLogs.filter((log) => {
            // Filter by selected user first
            if (selectedUser && log.actorUid !== selectedUser) {
                return false;
            }

            // Then filter by date
            if (!date || !date.from) return true; // No date filter applied

            const logDate = new Date(log.timestamp);
            
            const from = new Date(date.from);
            from.setHours(0, 0, 0, 0);

            if (date.to) { // Range selected
                const to = new Date(date.to);
                to.setHours(23, 59, 59, 999);
                return logDate >= from && logDate <= to;
            }
            
            // Single day selected
            const to = new Date(date.from);
            to.setHours(23, 59, 59, 999);
            return logDate >= from && logDate <= to;
        });
        
        async function processData() {
            const monthly = await getAccessData(filteredLogs);
            const hourly = await getHourlyAccessData(filteredLogs);
            setAccessData(monthly);
            setHourlyAccessData(hourly);
        }
        processData();

    }, [allLogs, date, loading, selectedUser]);
    
    if (loading) {
         return (
            <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Painel de Relatórios</h1>
                <p className="text-muted-foreground">Visão geral do aprendizado e engajamento da sua organização.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Filtros</CardTitle>
                    <CardDescription>Refine os dados dos relatórios abaixo por período ou usuário específico.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-4">
                     <DatePickerWithRange date={date} onDateChange={setDate} />
                     <UserSelect users={allUsers} selectedUser={selectedUser} onUserChange={setSelectedUser} />
                     <Button variant="ghost" onClick={() => {
                        setDate(undefined);
                        setSelectedUser(null);
                     }} disabled={!date && !selectedUser}>Limpar Filtros</Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccessChart data={accessData} />
                <HourlyAccessChart data={hourlyAccessData} />
            </div>
        </div>
    )
}
