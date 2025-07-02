'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartData = [
  { month: "Janeiro", desktop: 186 },
  { month: "Fevereiro", desktop: 305 },
  { month: "Março", desktop: 237 },
  { month: "Abril", desktop: 73 },
  { month: "Maio", desktop: 209 },
  { month: "Junho", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Conclusões",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Painel do Administrador</h1>
                <p className="text-muted-foreground">Visão geral do aprendizado e engajamento da sua organização.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total de Usuários</CardTitle>
                        <CardDescription>Número total de enfermeiros e técnicos ativos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">128</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Cursos Concluídos</CardTitle>
                        <CardDescription>Total de cursos concluídos este mês.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">342</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Taxa de Engajamento</CardTitle>
                        <CardDescription>Porcentagem de usuários ativos nos últimos 30 dias.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">87%</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Principal Dúvida</CardTitle>
                        <CardDescription>Tópico mais frequente nos chats com a mentora Florence.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">Dosagem de Medicação</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Cursos Concluídos por Mês</CardTitle>
                    <CardDescription>Janeiro - Junho 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
