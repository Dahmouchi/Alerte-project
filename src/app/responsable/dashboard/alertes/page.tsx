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
      },
      orderBy: { createdAt: "desc" },
      include: {
         persons: true,
         conlusions:{
          include:{
            createdBy:true,
          }
         },
       },
    });
  }
  return (
    <div className="overflow-hidden p-2 max-w-full">
      <div className="flex flex-col gap-2 ">
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
      <div className="relative w-full overflow-hidden mt-4">
        <ScrollArea className="w-full rounded-md border">
          <Shell className="p-0 sm:p-4">
            <DataTable data={alerts || []} columns={columns} />
          </Shell>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;
