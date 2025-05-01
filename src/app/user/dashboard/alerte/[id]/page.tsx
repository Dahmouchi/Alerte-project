/* eslint-disable @typescript-eslint/no-explicit-any */
import AlerteDaitls from "@/app/user/_components/AlerteDaitls";
import prisma from "@/lib/prisma";

export default async function Update(params:any) {
    const alert = await prisma.alert.findUnique({
        where: { code: params.params.id },
        include:{
          persons:true,
          files:true,
          conlusions:{
            orderBy:{
              createdAt:"asc",
            },
            include:{
              createdBy:true,
              files:true,
            }
          },
        }
      });
  return (
    <div className="">
     <AlerteDaitls alert={alert}/>
    </div>
  );
}
