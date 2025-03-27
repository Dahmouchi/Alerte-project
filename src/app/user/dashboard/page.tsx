import { columns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/data-table";
import { Shell } from "@/components/shells/shell";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { FilePlus } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";



const Dashboard =  async () => {
  const session = await getServerSession(authOptions);

let alerts: Awaited<ReturnType<typeof prisma.alert.findMany>> = []; // Infer type from Prisma

if (session) {
  alerts = await prisma.alert.findMany({
    where: { createdById: session.user.id },
    include: { persons: true },
  });
}
  return (
    <div className="overflow-scroll lg:overflow-hidden max-w-full">
      <div className="w-full flex itce justify-between mt-2">
        <div>
          <h1>List des Alertes </h1>
        </div>
      <Link href={"/user/dashboard/alerte/create"}>
          <div className="bg-red-600 text-white rounded-sm items-center gap-2 font-semibold justify-center flex px-6 py-2 w-full ">
          <FilePlus />
            Create Alert
          </div>
        </Link>
      </div>
      <Shell>
        <DataTable data={ alerts || []} columns={columns}/>
      </Shell>
     
    </div>
  );
};

export default Dashboard;
