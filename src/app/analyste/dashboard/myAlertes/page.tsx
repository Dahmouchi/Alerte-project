import { Shell } from "@/components/shells/shell";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { DataTable } from "../../_components/myAlertes-data-table/data-table";
import { columns } from "../../_components/myAlertes-data-table/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { User } from "lucide-react";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  if (session) {
    alerts = await prisma.alert.findMany({
      where: { assignedAnalystId: session.user.id },
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
    <div className="overflow-scroll lg:overflow-hidden max-w-full p-2">
       <div className="flex flex-col gap-2 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg lg:text-2xl font-semibold lg:font-bold tracking-tight">
            Alertes Assignées
          </h2>
        </div>
        <div className="flex lg:items-center items-start gap-2 flex-col lg:flex-row">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20">
            <User className="mr-1 h-3.5 w-3.5" />
            Assignées à vous
          </span>
          <p className="text-sm text-muted-foreground">
            Ces alertes nécessitent votre Traitement
          </p>
        </div>
      </div>
      <div className="relative w-full overflow-hidden mt-4 ">
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
