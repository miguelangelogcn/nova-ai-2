'use client';
import { getLogs } from "@/services/logs";
import { AccessChart } from "./access-chart";
import { HourlyAccessChart } from "./hourly-access-chart";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Helper function to process logs into monthly data
async function getAccessData(logs: any[]) {
  const employeeLogins = logs.filter(
    (log) => log.action === "USER_LOGIN" && log.actorRole === "desenvolvimento-funcionario"
  );

  const monthlyData: { [key: string]: { desktop: number; mobile: number } } = {};

  employeeLogins.forEach((log) => {
    const date = new Date(log.timestamp);
    const month = date.toLocaleString("pt-BR", { month: "long" });
    const year = date.getFullYear();
    const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { desktop: 0, mobile: 0 };
    }

    // Since we don't have device info, we'll simulate it for demonstration.
    if (Math.random() > 0.4) {
      monthlyData[key].desktop += 1;
    } else {
      monthlyData[key].mobile += 1;
    }
  });

  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => ({ month: month.split(' ')[0], ...data }))
    .sort((a, b) => {
        const monthOrder = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    })
    .slice(-6);
    
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
    const [loading, setLoading] = useState(true);
    const [accessData, setAccessData] = useState<any[]>([]);
    const [hourlyAccessData, setHourlyAccessData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const logs = await getLogs();
            const monthly = await getAccessData(logs);
            const hourly = await getHourlyAccessData(logs);
            setAccessData(monthly);
            setHourlyAccessData(hourly);
            setLoading(false);
        }
        fetchData();
    }, []);
    
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccessChart data={accessData} />
                <HourlyAccessChart data={hourlyAccessData} />
            </div>
        </div>
    )
}
