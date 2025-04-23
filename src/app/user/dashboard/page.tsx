import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Shell } from "@/components/shells/shell";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { FilePlus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = [];

  if (session) {
    alerts = await prisma.alert.findMany({
      where: { createdById: session.user.id, step: 2 },
      orderBy: { updatedAt: "desc" },
      include: { persons: true },
    });
  }

  return (
    <div className="w-full max-w-full p-2 sm:p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Liste des Alertes</h2>
          <p className="text-sm text-muted-foreground mt-1 sm:mt-0">
            Cette section regroupe toutes les alertes que vous avez envoyées.
          </p>
        </div>
        
        {/* Create Alert Button (Responsive) */}
        <Link href="/user/dashboard/alerte/create" className="w-full sm:w-auto">
          <div className="relative bg-red-600 text-white text-sm sm:text-[14px] px-4 font-semibold pl-5 h-11 sm:h-[2.8em] rounded-md flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#1F7D53] group hover:bg-red-700 transition-colors">
            <span className="mr-8 sm:mr-10">Créer une alerte</span>
            <div className="absolute right-[0.3em] bg-white h-[1.8em] sm:h-[2.2em] w-[1.8em] sm:w-[2.2em] rounded-sm flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)] shadow-[0.1em_0.1em_0.6em_0.2em_#1F7D53] active:scale-95">
              <FilePlus className="text-red-700 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Data Table Section (Responsive) */}
      <div className="relative w-full overflow-hidden">
        <ScrollArea className="w-full rounded-md border">
          <Shell className="p-0 sm:p-4">
            <DataTable 
              data={alerts || []} 
              columns={columns} 
            />
          </Shell>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;