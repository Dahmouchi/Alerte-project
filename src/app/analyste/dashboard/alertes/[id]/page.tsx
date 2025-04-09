/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertDetails from "@/app/analyste/_components/AlertDetails";
import { CriticalityBadge } from "@/components/CritiqueBadg";
import prisma from "@/lib/prisma";
import React from "react";

const Alert = async (params: any) => {
  if (!params?.params.id) {
    return <p>Invalid alert ID</p>;
  }

  const alert = await prisma.alert.findUnique({
    where: { id: params.params.id },
    include: {
      conlusions:{
        include:{
          createdBy:true,
        }
      },
      files: true,
      persons: true,
      assignedAnalyst:true,
      assignedResponsable:true,
    },
  });
  
  if (!alert) return <p>Alert not found</p>;

  return (
    <div>
      <div className="flex items-center lg:justify-start gap-2 justify-center space-y-2">
        <h2 className="lg:text-2xl lg:font-bold font-semibold text-lg py-1 tracking-tight">
          Alerte criticité
        </h2>
                <CriticalityBadge level={alert.criticite as 1 | 2 | 3 | 4} />    
        
      </div>
      <AlertDetails alert={alert} />
    </div>
  );
};

export default Alert;
