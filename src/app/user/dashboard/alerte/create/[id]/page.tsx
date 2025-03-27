/* eslint-disable @typescript-eslint/no-explicit-any */
import Step2 from "@/app/user/_components/Step2";
import prisma from "@/lib/prisma";

export default async function Update(params:any) {
    const alert = await prisma.alert.findUnique({
        where: { code: params.params.id },
        include:{
          persons:true,
          files:true,
        }
      });
  return (
    <div className="">
     <Step2 alert={alert}/>
    </div>
  );
}
