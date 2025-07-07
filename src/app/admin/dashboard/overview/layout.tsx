/* eslint-disable @typescript-eslint/no-unused-vars */
import PageContainer from "@/components/layout/page-container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { AlertTriangle, CheckCircle, Rows, Users } from "lucide-react";
import React from "react";
import DashboardCharts from "../../_components/DashboardCharts";

export default async function OverViewLayout({
  sales,
  bar_stats,
}: {
  sales: React.ReactNode;
  bar_stats: React.ReactNode;
}) {
  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = []; // Infer type from Prisma
  const pendingAlerts = await prisma.alert.count({
    where: {
      step: 2,
      status: "EN_COURS_TRAITEMENT",
    },
  });

  const totalAlerts = await prisma.alert.count({
    where: {
      step: 2,
      status: "REJETE",
    },
  });

  const aprovedAlert = await prisma.alert.count({
    where: {
      step: 2,
      status: "TRAITE",
    },
  });
  users = await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN",
      },
    },
  });

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2 relative">
        <div className="flex items-center justify-between space-y-2">
         
        </div>

        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card] grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
          <Card className="@container/card bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {users.length}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Nombre total des utilisateurs enregistrés{" "}
                <Users className="size-4" />
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-white dark:bg-slate-950">
            <CardHeader>
             
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {pendingAlerts}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Alertes en attente de traitement{" "}
                <AlertTriangle className="size-4" />
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {aprovedAlert}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Alertes traitées avec succès <CheckCircle className="size-4" />
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-white dark:bg-slate-950">
            <CardHeader>
              
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalAlerts}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Le nombre total des alertes refusées <Rows className="size-4" />
              </div>
            </CardFooter>
          </Card>
        </div>
        <DashboardCharts />
      </div>
    </PageContainer>
  );
}
