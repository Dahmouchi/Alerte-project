import { Shell } from "@/components/shells/shell";
import prisma from "@/lib/prisma";
import React from "react";
import { DataTable } from "../../_components/user-data-table/data-table";
import { columns } from "../../_components/user-data-table/columns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AddUser from "../../_components/AddUser";

const Users = async () => {
  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = []; // Infer type from Prisma

  users = await prisma.user.findMany({
    orderBy:{
      createdAt:"desc"
    }
  });
  
  return (
    <div className="overflow-hidden max-w-full">
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">
        Liste des utilisateurs
      </h2>
      <div>
        <AddUser />
      </div>
    </div>

    <ScrollArea className="lg:w-auto w-96 whitespace-nowrap rounded-md ">
      <Shell>
        <DataTable data={users || []} columns={columns} />
      </Shell>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
</div>
  );
  
};

export default Users;
