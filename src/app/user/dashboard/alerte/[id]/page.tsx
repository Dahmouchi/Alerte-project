/* eslint-disable @typescript-eslint/no-explicit-any */
import  prisma  from "@/lib/prisma";

export default async function AlertPage(params:any ) {
  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
    include:{
      persons:true,
    }
  });
  if (!alert) return <p>Alert not found</p>;

  return (
    <div>
      <h1>Resume Alert: {alert.code}</h1>
      <p>Step: {alert.step}</p>
      <a href={`/user/dashboard/alerte/create/${alert.code}`} className="bg-green-500 text-white px-4 py-2">
        Continue
      </a>
    </div>
  );
}
