"use server";

import prisma from "@/lib/prisma";
import { createHistoryRecord } from "./alertActions";



export async function analysteAssign(
  analysteId: string,
  alertId:string,
) {
  try { 
      const updatedAlert = await prisma.alert.update({
        where: { id: alertId },
        data: {
          assignedAnalystId: analysteId,
          adminStatus: "ASSIGNED",
        },
      });
      createHistoryRecord(
        alertId,
        analysteId,
        'ASSIGN_ANALYST',
        `L'analyste s'est assigné cette alerte`,
      )
      return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}

export async function removeAnalysteAssignment(alertId: string,analysteId:string) {
  try {
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        assignedAnalystId: null,
        adminStatus: "PENDING", // or "UNASSIGNED" if that's your logic
        recevable:"NON_DECIDE",
      },
    });
    createHistoryRecord(
      alertId,
      analysteId,
      'REMOVE_ASSIGNMENT',
     `L'assignation de l'analyste a été supprimée`
    )
    return updatedAlert;
  } catch (error) {
    console.error("Error removing analyst assignment:", error);
    throw new Error("Failed to remove analyst assignment");
  }
}