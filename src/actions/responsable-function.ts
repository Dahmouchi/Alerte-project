
"use server";

import prisma from "@/lib/prisma";
import { createHistoryRecord } from "./alertActions";


export async function ResponsableAssign(
    responsableId: string,
    alertId:string,
  ) {
    try { 
        const updatedAlert = await prisma.alert.update({
          where: { id: alertId },
          data: {
            assignedResponsableId: responsableId,
            adminStatus: "ASSIGNED",
          },
        });
        createHistoryRecord(
          alertId,
          responsableId,
          'ASSIGN_RESPONSABLE',
          `Le responsalbe s'est assigné cette alerte`,
        )
        return updatedAlert;
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw new Error("Failed to retrieve user info");
    }
  }

  export async function removeResponsableAssignment(alertId: string,responsableId:string) {
    try {
      const updatedAlert = await prisma.alert.update({
        where: { id: alertId },
        data: {
          assignedResponsableId: null,
          responsableValidation: "PENDING", 
        },
      });
      createHistoryRecord(
        alertId,
        responsableId,
        'REMOVE_ASSIGNMENT',
       `L'assignation de responsable a été supprimée`
      )
      return updatedAlert;
    } catch (error) {
      console.error("Error removing analyst assignment:", error);
      throw new Error("Failed to remove analyst assignment");
    }
  }