/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartDatas = [
  { browser: "chrome", visitors: 275, fill: "#347928" },
  { browser: "safari", visitors: 200, fill: "#FF9B45" },
  { browser: "firefox", visitors: 287, fill: "#E50046" },

]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  TRAITE: {
    label: "Alerte Traité",
    color: "hsl(var(--chart-1))",
  },
  EN_COURS_TRAITEMENT: {
    label: "Alerte Attente",
    color: "hsl(var(--chart-2))",
  },
  INFORMATIONS_MANQUANTES: {
    label: "Information manquante",
    color: "hsl(var(--chart-3))",
  },
  REJETE: {
    label: "Alerte Rejté",
    color: "hsl(var(--chart-3))",
  },
 
} satisfies ChartConfig
const STATUS_COLORS: Record<string, string> = {
  EN_COURS_TRAITEMENT: "#347928", // chrome
  TRAITE: "#FF9B45",              // safari
  REJETE: "#E50046",              // firefox
  INFORMATIONS_MANQUANTES:"#6439FF",
};



type Props = {
  alerts: any;
};
export function ChartCirculare({ alerts }: Props) {
 
  const chartData = React.useMemo(() => {
    const statusCount: Record<string, number> = {
      EN_COURS_TRAITEMENT: 0,
      TRAITE: 0,
      REJETE: 0,
      INFORMATIONS_MANQUANTES:0,
    };

    alerts.forEach((alert:any) => {
      if (statusCount[alert.status] !== undefined) {
        statusCount[alert.status]++;
      }
    });

    return Object.entries(statusCount).map(([status, visitors]) => ({
      browser: status,
      visitors,
      fill: STATUS_COLORS[status],
    }));
  }, [alerts]);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);
  return (
    <Card className="flex flex-col bg-white dark:bg-slate-950">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Alertes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          alertes par statut <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total d&apos;alertes triées par statut
        </div>
      </CardFooter>
    </Card>
  )
}
