/* eslint-disable @typescript-eslint/no-explicit-any */
import AlertDetails from "@/app/admin/_components/AlertDetails";
import prisma from "@/lib/prisma";
import React from "react";

interface AlertDetailsProps {
  params: { id: string };
}

const Alert = async ({ params }: AlertDetailsProps) => {
  if (!params?.id) {
    return <p>Invalid alert ID</p>;
  }

  const alert = await prisma.alert.findUnique({
    where: { id: params.id },
    include: {
      persons: true,
    },
  });

  if (!alert) return <p>Alert not found</p>;

  return (
    <div>
      <h1>Alert Details</h1>
      <AlertDetails alert={alert} />
    </div>
  );
};

export default Alert;
