/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AlerteChart.tsx
"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  alerts: {
    label: "Alerts",
    color: "#0000FF",
  },
} satisfies ChartConfig;

export function AlerteChart({alertData,isLoading}:{alertData:any,isLoading:boolean}) {

  return (
    <Card className="h-full">
      <CardContent className="">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center mt-3">
              <div className="flex flex-col space-y-4 w-full">
                {/* Chart Header Skeleton */}
                <div className="flex justify-between items-center w-full">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-9 w-full" />
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
                dataKey="Nombre"
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
