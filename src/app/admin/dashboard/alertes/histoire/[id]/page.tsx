/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertHistoryPage from "@/app/admin/_components/histroy/History";
import prisma from "@/lib/prisma";
import React from "react";

const Alert = async (params: any) => {
  if (!params?.params.id) {
    return <p>Invalid alert ID</p>;
  }

  const alert = await prisma.alertHistory.findMany({
    where: { alertId: params.params.id },
    orderBy:{
      createdAt:"desc"
    },
    include: {
      alert: true,
      user: true,
    },
  });
  if (!alert) return <p>Alert not found</p>;

  return (
    <div>
      <AlertHistoryPage historyData={alert} />
    </div>
  );
};

export default Alert;
