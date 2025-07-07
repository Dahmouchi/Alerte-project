/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { BarChart, CartesianGrid, Rectangle, XAxis, Bar } from "recharts"
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

export function CriticiteChart({data}:{data:any}) {
 
  const chartConfig: ChartConfig = {
    // Add your chart configuration here if needed
  }

  return (
    <Card className="flex flex-col bg-white dark:bg-slate-950 h-full">
      <CardHeader>
        <CardTitle>Alertes par Criticité</CardTitle>
        <CardDescription>Nombre d&apos;alertes regroupées par niveau</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="Nombre"
              strokeWidth={2}
              radius={8}
              activeBar={(props: any) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            >
              {data.map((entry:any, index:any) => (
                <Rectangle
                  key={`bar-${index}`}
                  fill={entry.fill}
                  x={index * 20} // Adjust positioning as needed
                  width={20}     // Adjust bar width as needed
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Données à jour <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total d&apos;alertes par niveau de criticité
        </div>
      </CardFooter>
    </Card>
  )
}