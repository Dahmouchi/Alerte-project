import Step2 from "@/app/[local]/user/_components/Step2";
import prisma from "@/lib/prisma";

export default async function Update({ params }: { params: { id: string } }) {
    const alert = await prisma.alert.findUnique({
        where: { code: params.id },
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
