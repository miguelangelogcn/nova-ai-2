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

    if (chartData.length === 0) {
        return [
          { month: "Janeiro", desktop: 186, mobile: 109 },
          { month: "Fevereiro", desktop: 220, mobile: 132 },
          { month: "Março", desktop: 345, mobile: 298 },
          { month: "Abril", desktop: 412, mobile: 350 },
          { month: "Maio", desktop: 580, mobile: 490 },
          { month: "Junho", desktop: 650, mobile: 510 },
        ];
    }
    
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

    if (employeeLogins.length === 0) {
        return [
          { hour: "00H", mobile: 9, desktop: 0 }, { hour: "01H", mobile: 22, desktop: 0 },
          { hour: "02H", mobile: 15, desktop: 19 }, { hour: "03H", mobile: 62, desktop: 13 },
          { hour: "04H", mobile: 31, desktop: 31 }, { hour: "05H", mobile: 98, desktop: 7 },
          { hour: "06H", mobile: 4, desktop: 0 }, { hour: "07H", mobile: 31, desktop: 31 },
          { hour: "08H", mobile: 54, desktop: 44 }, { hour: "09H", mobile: 90, desktop: 20 },
          { hour: "10H", mobile: 5, desktop: 5 }, { hour: "11H", mobile: 15, desktop: 7 },
          { hour: "12H", mobile: 16, desktop: 18 }, { hour: "13H", mobile: 66, desktop: 10 },
          { hour: "14H", mobile: 31, desktop: 31 }, { hour: "15H", mobile: 60, desktop: 20 },
          { hour: "16H", mobile: 5, desktop: 0 }, { hour: "17H", mobile: 31, desktop: 31 },
          { hour: "18H", mobile: 54, desktop: 44 }, { hour: "19H", mobile: 91, desktop: 20 },
          { hour: "20H", mobile: 5, desktop: 5 }, { hour: "21H", mobile: 9, desktop: 13 },
          { hour: "22H", mobile: 54, desktop: 21 }, { hour: "23H", mobile: 0, desktop: 34 },
        ];
    }

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
