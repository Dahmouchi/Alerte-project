import PageContainer from "@/components/layout/page-container";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { AlertCircle, AlertTriangle, CheckCircle, Rows } from "lucide-react";
import { getServerSession } from "next-auth";
import React from "react";

export default async function OverViewLayout({
  sales,
  bar_stats,
}: {
  sales: React.ReactNode;
  bar_stats: React.ReactNode;
}) {  
  
    const session = await getServerSession(authOptions);
  
  const pendingAlerts = await prisma.alert.count({
    where: {
      step: 2,
      responsableValidation: "PENDING",
      NOT: {
        adminStatus: "PENDING"
      }
    },
  });
  const totalAlerts = await prisma.alert.count({
    where: {
      step: 2,
      adminStatus: "DECLINED",
    },
  });
  const analysteAlertes = await prisma.alert.count({
    where: {
      step: 2,
      assignedResponsableId:session?.user.id,
    },
  });
  const aprovedAlert = await prisma.alert.count({
    where: {
      step: 2,
      adminStatus: "APPROVED",
    },
  });
 
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Ravi de vous revoir 👋
          </h2>
        </div>

        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card] grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
        <Card className="@container/card bg-white dark:bg-slate-950">
  <CardHeader>
    <CardDescription>Alertes de l&apos;analyste</CardDescription>
    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
      {analysteAlertes || 0}
    </CardTitle>
  </CardHeader>
  <CardFooter className="flex-col items-start gap-1.5 text-sm">
    <div className="line-clamp-1 flex gap-2 font-medium">
      Nombre total des alertes assignées à vous{" "}
      <AlertCircle className="size-4" /> {/* Changed from Users to AlertCircle */}
    </div>
  </CardFooter>
</Card>

          <Card className="@container/card bg-white dark:bg-slate-950">
            <CardHeader>
              <CardDescription>
                Nombre d&apos;Alertes Non Traitées
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {pendingAlerts}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Alertes en attente de traitement et a été assignées{" "}
                <AlertTriangle className="size-4" />
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card bg-white dark:bg-slate-950">
            <CardHeader>
              <CardDescription>Nombre d&apos;Alerte Traitées</CardDescription>
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
              <CardDescription>
                Nombre d&apos;Alertes non acceptées{" "}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {totalAlerts}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Le nombre total des alertes refusé <Rows className="size-4" />
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">{bar_stats}</div>
          <div className="col-span-4 md:col-span-3">
            {/* sales arallel routes */}
            {sales}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
