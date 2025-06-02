/* eslint-disable @typescript-eslint/no-explicit-any */
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
// Utility to assign a color for each category

type Props = {
  chartData: {
    browser: string;
    visitors: number;
    fill: string;
  }[];
  isLoading?: boolean;
};

export function ChartCirculare({ chartData, isLoading }: Props) {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="flex flex-col bg-white dark:bg-slate-950 h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Alertes par catégorie</CardTitle>
        <CardDescription>Répartition des alertes selon les catégories</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row lg:items-center gap-2 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto lg:min-h-[220px]">
          <PieChart className="w-fit">
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-sm font-medium">Légende</h3>
          <div className="grid grid-cols-1 gap-2">
             {chartData.map((item) => (
                <div key={item.browser} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm">
                    {item.browser}: {item.visitors} ({Math.round((item.visitors / totalVisitors) * 100)}%)
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          alertes par catégorie <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total d&apos;alertes triées par catégorie
        </div>
      </CardFooter>
    </Card>
  );
}