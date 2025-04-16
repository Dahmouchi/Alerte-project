import { Shell } from "@/components/shells/shell";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { DataTable } from "../../_components/alerte-data-table/data-table";
import { columns } from "../../_components/alerte-data-table/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  if (session) {
    alerts = await prisma.alert.findMany({
      where: {
        step: 2,
        responsableValidation: "PENDING",
      },
      orderBy: { createdAt: "desc" },
    });
  }
  return (
    <div className="overflow-hidden max-w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg lg:text-2xl font-semibold lg:font-bold tracking-tight">
            Liste des Alertes
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Ces alertes ont été validées par l&apos;analyste et sont en attente de
          votre action.
        </p>
      </div>
      <ScrollArea className="lg:w-auto w-96 whitespace-nowrap rounded-md ">
        <Shell>
          <DataTable data={alerts || []} columns={columns} />
        </Shell>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
