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

  let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

  if (session) {
    alerts = await prisma.alert.findMany({
      where: { createdById: session.user.id, step: 2 },
      orderBy: {
        updatedAt:"desc"
      },
      include: { persons: true },
    });
  }
  return (
    <div className="overflow-scroll lg:overflow-hidden max-w-full">
      <div className="w-full flex itce justify-between mt-2">
        <h2 className="text-2xl font-bold tracking-tight">List des Alertes</h2>

        <Link href={"/user/dashboard/alerte/create"}>
          <div className="relative bg-red-600 text-white text-[14px] px-4 font-semibold pl-5 h-[2.8em] rounded-md flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#1F7D53] group">
            <span className="mr-10">Crée une alerte</span>
            <div className="absolute right-[0.3em] bg-white h-[2.2em] w-[2.2em] rounded-sm flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)] shadow-[0.1em_0.1em_0.6em_0.2em_#1F7D53] active:scale-95">
              <FilePlus className="text-red-700" />
            </div>
          </div>
        </Link>
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
