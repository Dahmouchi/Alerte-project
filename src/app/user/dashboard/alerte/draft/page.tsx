import { columns } from "@/app/user/_components/data-table-draft/columns";
import { DataTable } from "@/app/user/_components/data-table-draft/data-table";
import { Shell } from "@/components/shells/shell";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  if (session) {
    alerts = await prisma.alert.findMany({
      where: { createdById: session.user.id, step:1 },
      include: { persons: true },
    });
  }
  return (
    <div className="overflow-scroll lg:overflow-hidden max-w-full">
      <div className="w-full flex itce justify-between mt-2">
      <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
          List des Alertes
          </h2>
        </div>   
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
