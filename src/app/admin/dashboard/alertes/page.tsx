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
      where: { step: 2 },
      orderBy:{createdAt:"desc"},
      include: { persons: true },
    });
  }
  return (
    <div className="overflow-hidden max-w-full">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Liste des Alertes
          </h2>
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
