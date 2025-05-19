/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
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
  desktop: {
    label: "Alertes",
    color: "#6439FF",
  },
} satisfies ChartConfig



type RadarGraphProps = {
  alertes: any,
}

export function RadarGraph({ alertes }: RadarGraphProps) {
  const chartData = React.useMemo(() => {
    const countsByMonth: Record<string, number> = {}

    // Group alerts by month name
    alertes.forEach((alerte:any) => {
      const date = new Date(alerte.createdAt)
      const month = date.toLocaleString("default", { month: "long" }) // e.g., "January"
      countsByMonth[month] = (countsByMonth[month] || 0) + 1
    })

    // Optional: ensure months are sorted in calendar order (Jan to Dec)
    const orderedMonths = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ]

    return orderedMonths
      .map((month) => ({
        month,
        desktop: countsByMonth[month] || 0,
      }))
      .filter((item) => item.desktop > 0) // only include months with data
      .slice(-6) // show only last 6 months
  }, [alertes])

  const dateRangeText = chartData.length
    ? `${chartData[0].month} - ${chartData[chartData.length - 1].month} ${new Date().getFullYear()}`
    : "No data"

  return (
    <Card className="bg-white dark:bg-slate-950">
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar Chart -Alertes par mois</CardTitle>
        <CardDescription>
          Affichage du nombre total d&apos;alertes par mois
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" radialLines={false} />
            <PolarAngleAxis dataKey="month" />
            <Radar
              dataKey="desktop"
              fill="#4F75FF"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Alertes par mois <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {dateRangeText}
        </div>
      </CardFooter>
    </Card>
  )
}
