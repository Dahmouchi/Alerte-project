// components/AlerteChart.tsx
"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableYears, getAlertDataByYear } from "@/actions/alertActions";
import { Skeleton } from "@/components/ui/skeleton";

type AlertData = {
  month: string;
  count: number;
};

const chartConfig = {
  alerts: {
    label: "Alerts",
    color: "#0000FF",
  },
} satisfies ChartConfig;

export function AlerteChart() {
  const [alertData, setAlertData] = useState<AlertData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available years on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const years = await getAvailableYears();
        setAvailableYears(years);

        if (years.length > 0) {
          // Set to most recent year by default
          const latestYear = Math.max(...years);
          setSelectedYear(latestYear);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Fetch alert data when year changes
  useEffect(() => {
    const loadAlertData = async () => {
      if (!selectedYear) return;
      setIsLoading(true);
      try {
        const data = await getAlertDataByYear(selectedYear);
        setAlertData(data);
      } catch (error) {
        console.error("Error loading alert data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAlertData();
  }, [selectedYear]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Alert Statistics</CardTitle>
            <CardDescription>
              Showing alert counts by month for {selectedYear}
            </CardDescription>
          </div>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
            disabled={availableYears.length === 0}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            {availableYears.length === 0 ? (
              "No data available"
            ) : (
              <div className="flex flex-col space-y-4">
                {/* Chart Header Skeleton */}
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[180px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-9 w-[120px]" />
                </div>

                {/* Chart Area Skeleton */}
                <div className="relative h-[300px] w-full">
                 

                  {/* Chart grid lines */}
                  <div className="absolute left-12 right-3 top-0 bottom-10 flex flex-col justify-between">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-px w-full" />
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="absolute left-12 right-3 top-0 bottom-10">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={alertData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="count"
                type="linear"
                fill="var(--color-alerts)"
                fillOpacity={0.4}
                stroke="var(--color-alerts)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
