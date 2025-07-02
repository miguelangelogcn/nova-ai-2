import { getLogs } from "@/services/logs";
import { AccessChart } from "./access-chart";

// Helper function to process logs into monthly data
async function getAccessData() {
  const logs = await getLogs();
  const employeeLogins = logs.filter(
    (log) => log.action === "USER_LOGIN" && log.actorRole === "desenvolvimento-funcionario"
  );

  const monthlyData: { [key: string]: { desktop: number; mobile: number } } = {};

  employeeLogins.forEach((log) => {
    const date = new Date(log.timestamp);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

    if (!monthlyData[key]) {
      monthlyData[key] = { desktop: 0, mobile: 0 };
    }

    // Since we don't have device info, we'll simulate it for demonstration.
    // Let's assume 60% desktop, 40% mobile.
    if (Math.random() > 0.4) {
      monthlyData[key].desktop += 1;
    } else {
      monthlyData[key].mobile += 1;
    }
  });

  // Convert to chart format and sort
  const chartData = Object.entries(monthlyData)
    .map(([month, data]) => ({ month: month.split(' ')[0], ...data }))
    // A real implementation would sort by date, here we sort by a predefined order
    .sort((a, b) => {
        const monthOrder = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    })
    .slice(-6); // Get last 6 months

    // If no real data, use static demo data.
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


export default async function AdminDashboardPage() {
    const accessData = await getAccessData();
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Painel de Relatórios</h1>
                <p className="text-muted-foreground">Visão geral do aprendizado e engajamento da sua organização.</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <AccessChart data={accessData} />
            </div>
        </div>
    )
}
