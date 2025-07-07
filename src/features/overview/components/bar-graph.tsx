"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAlerts } from "@/hooks/use-alerte";
import {  TrendingUp } from "lucide-react";

export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Nombre d'alerte",
  },
  alertes: {
    label: "Alertes",
    color: "var(--primary)",
  },
  error: {
    label: "Error",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface ChartDataItem {
  date: string;
  alertes: number;
}

export function BarGraph() {
  const { data: alerts } = useAlerts();
  // Process data to group alerts by date
  const chartData = React.useMemo<ChartDataItem[]>(() => {
    if (!alerts) return [];

    const groupedData = alerts.reduce(
      (acc: Record<string, number>, alert: { createdAt: string }) => {
        const date = new Date(alert.createdAt).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    return Object.entries(groupedData).map(
      ([date, alertes]): ChartDataItem => ({
        date,
        alertes: Number(alertes), // Explicitly ensure this is a number
      })
    );
  }, [alerts]);

  // Get total number of alerts
  const totalAlerts = chartData.reduce((sum, day) => sum + day.alertes, 0);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("alertes");

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  // Add this calculation after your existing chartData processing
  

  React.useEffect(() => {
    if (activeChart === "error") {
      throw new Error("Mocking Error");
    }
  }, [activeChart]);

  if (!isClient) {
    return null;
  }

  return (
    <Card className="@container/card !pt-3 h-full bg-white dark:bg-slate-950">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-2 px-6 !py-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold tracking-tight">
               Nb total d&apos;alertes
              
            </CardTitle>
           <div>
           <span className="text-xl mr-2 font-bold tabular-nums text-foreground">
              {totalAlerts}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
               Alertes
            </span>
           </div>
            
          </div>
         
        </div>
        <div className="flex">
          {["alertes", "error"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0000FF" stopOpacity={1} />
            <stop offset="100%" stopColor="#0000CD" stopOpacity={1} />
          </linearGradient>
        </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--primary)", opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
