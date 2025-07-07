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
      orderBy: { createdAt: "desc" },
      include: {
        persons: true,
        conlusions: {
          include: {
            createdBy: true,
          },
        },
      },
    });
  }
  return (
    <div className="overflow-hidden max-w-full p-2">
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg lg:text-2xl font-semibold lg:font-bold tracking-tight">
            Toutes les Alertes
          </h2>
        </div>
        
      </div>
      <ScrollArea className=" relative w-full rounded-md border ">
        <div className="relative w-full overflow-hidden ">
          <Shell className="p-0 sm:p-4">
            <DataTable data={alerts || []} columns={columns} />
          </Shell>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
