"use server";

import prisma from "@/lib/prisma";
import { createHistoryRecord } from "./alertActions";
import { AlertStatus, UserAlertStatus } from "@prisma/client";
import { io } from "socket.io-client";

export async function ResponsableAssign(
  responsableId: string,
  alertId: string
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
      "ASSIGN_RESPONSABLE",
      `Le responsalbe s'est assigné cette alerte`
    );
    return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}

export async function removeResponsableAssignment(
  alertId: string,
  responsableId: string
) {
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
      "REMOVE_ASSIGNMENT",
      `L'assignation de responsable a été supprimée`
    );
    return updatedAlert;
  } catch (error) {
    console.error("Error removing analyst assignment:", error);
    throw new Error("Failed to remove analyst assignment");
  }
}
export async function responsableValidation(
  userId: string,
  alertId: string,
  validationStatus: UserAlertStatus, // Assuming this is your enum type
  content: string
) {
  let statusToSet: AlertStatus;

  if (validationStatus === "APPROVED") {
    statusToSet = "TRAITE";
  } else if (validationStatus === "DECLINED") {
    statusToSet = "REJETE";
  } else if (validationStatus === "INFORMATIONS_MANQUANTES") {
    statusToSet = "INFORMATIONS_MANQUANTES";
  }else{
    throw new Error("Statut de validation non valide.");
  }
  try {
    // Update the alert status
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        responsableValidation: "APPROVED",
        involved:true,
        status: statusToSet,
        conclusion:content,
        updatedAt: new Date(),
      },
    });

    if(userId){
      await prisma.notification.create({
        data:{
          userId:updatedAlert.createdById,
          title:"Messages informatifs",
          message:`Alerte ${updatedAlert.code} traitée. Veuillez consulter la nouvelle réponse.`,
          type:"SYSTEM",
          relatedId:updatedAlert.code,
        }
      })
    }
    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.emit("notifyUser");
    // Create history record
    await createHistoryRecord(
      alertId,
      userId,
      "RESPONSABLE_VALIDATION",
      `Responsable validation `
    );

    return updatedAlert;
  } catch (error) {
    console.error("Error in responsable validation:", error);
    throw new Error("Failed to process responsable validation");
  }
}
