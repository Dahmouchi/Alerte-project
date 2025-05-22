/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function RecentSales(alerts: any) {
  const startDate = startOfMonth(new Date()); // First day of the month
  const endDate = endOfMonth(new Date()); // Last day of the month

  const alertsThisMonth = await prisma.alert.count({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
  return (
    <Card className="bg-white dark:bg-slate-950">
    <CardHeader>
      <CardTitle>Alertes récentes</CardTitle>
      <CardDescription>
        Vous recevez {alertsThisMonth} alertes ce mois-ci.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[300px] w-full rounded-md border">
        <div className="space-y-1 p-1">
          {alerts.alerts.map((sale: any, index: any) => (
            <div
              key={index}
              className="flex items-center hover:bg-slate-100 dark:hover:bg-slate-900 py-3 px-3 rounded-md"
            >
              <div className="space-y-1">
                <p className="text-sm leading-none font-medium">{sale.title}</p>
                <p className="text-muted-foreground text-sm">
                  {
                  sale.createdAt.toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div
                className={`ml-auto font-medium text-[10px] px-2 py-1 rounded text-white
                  ${
                    sale.adminStatus === "PENDING"
                      ? "bg-yellow-500"
                      : sale.adminStatus === "ASSIGNED"
                      ? "bg-blue-700"
                      : sale.adminStatus === "APPROVED"
                      ? "bg-green-700"
                      : sale.adminStatus === "DECLINED"
                      ? "bg-red-700"
                      : sale.adminStatus === "ESCALATED"
                      ? "bg-purple-500"
                      : "bg-gray-500"
                  }
                `}
              >
                {sale.adminStatus}
              </div>
              <Link href={`/analyste/dashboard/alertes/${sale.code}`}>
                <div className="ml-2 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-sm p-1 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
  );
}
