/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertDetails from "@/app/admin/_components/AlertDetails";
import prisma from "@/lib/prisma";
import React from "react";

const Alert = async (params: any) => {
  if (!params?.params.id) {
    return <p>Invalid alert ID</p>;
  }

  const alert = await prisma.alert.findUnique({
    where: { id: params.params.id },
    include: {
      files: true,
      persons: true,
      assignedAnalyst:true,
      assignedResponsable:true,
      conlusions:{
        include:{
          createdBy:true,
        }
      },
    },
  });
  
  if (!alert) return <p>Alert not found</p>;

  return (
    <div>
             <AlertDetails alert={alert} />
    </div>
  );
};

export default Alert;
