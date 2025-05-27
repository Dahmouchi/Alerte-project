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
import { getAlerteByCriticite } from "@/actions/alertActions"

const criticiteLabels: Record<number, string> = {
  0: "Non classé",
  1: "Faible",
  2: "Modérée",
  3: "Élevée",
  4: "Critique",
}

const criticiteColors: Record<number, string> = {
  0: "#94a3b8",  // Neutral - slate-400
  1: "#4ade80",  // Green - green-400
  2: "#0096FF",  // Yellow - yellow-400
  3: "#FFA500",  // Orange - orange-400
  4: "#FF0000",  // Red - red-400
}

type AlerteChartItem = {
  label: string
  count: number
  fill: string
}

// Initialize with all criticity levels
const initialData: AlerteChartItem[] = [0, 1, 2, 3, 4].map((level) => ({
  label: criticiteLabels[level],
  count: 0,
  fill: criticiteColors[level],
}))

export function CriticiteChart() {
  const [data, setData] = useState<AlerteChartItem[]>(initialData)

  useEffect(() => {
    async function fetchData() {
      const json = await getAlerteByCriticite()
      
      // Create a map from the API data for easy lookup
      const apiDataMap = new Map<number, number>()
      json.forEach((item: { criticite: number; count: number }) => {
        apiDataMap.set(item.criticite, item.count)
      })
      
      // Update the initial data with counts from API
      const updatedData = initialData.map(item => {
        const level = Object.entries(criticiteLabels).find(
          ([_, label]) => label === item.label
        )?.[0]
        const count = apiDataMap.get(Number(level)) || 0
        return { ...item, count }
      })
      
      setData(updatedData)
    }

    fetchData()
  }, [])

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
              dataKey="count"
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
              {data.map((entry, index) => (
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