/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import { AlertHistory, RecevalbeStatus, UserAlertStatus } from "@prisma/client";

export async function updateAlert(
  alertId: string,
  formData: any,
  step: number,
  persons: { nom?: string; prenom?: string ; fonction?: string }[],
  files: File[], // This can be images and audio
  audioFile: File | null, // New field for audio file
  anonymeUser: string,
  type: string,
  anonyme: boolean,
  selectedCategory: string,
) {
  try { 
    const imageUrls: string[] = [];
    const audioUrl: string | null = audioFile ? await uploadAudio(audioFile) : null;

    if (files) {
      for (const image of files) {
        const arrayBuffer = await image.arrayBuffer();
        const fileContent = Buffer.from(arrayBuffer);
        const uploadResponse = await uploadFile(fileContent, image.name, image.type);
        const imageUrl = getFileUrl(uploadResponse.Key); // Assuming Key contains the file name
        imageUrls.push(imageUrl);
      }
    }

    // Update the alert first
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        ...formData,
        dateLieu: formData.dateLieu ? new Date(formData.dateLieu) : null,
        files: {
          create: imageUrls.map((url) => ({ url })),
        },
        audioUrl, // Store the new audio URL here
        step,
        contactPreference: anonymeUser,
        involved: anonyme,
        category: selectedCategory,
        type,
        status: "EN_COURS_TRAITEMENT"
      },
    });

    // Insert or update persons linked to the alert
    if (anonyme) {
      if (persons.length > 0) {
        await prisma.persons.createMany({
          data: persons.map((person) => ({
            codeAlert: alertId, // Link person to the alert
            nom: person.nom || null,
            prenom: person.prenom || null,
            fonction: person.fonction || null,
          })),
          skipDuplicates: true,
        });
      }
    } else {
      // Delete existing persons if not anonymous
      await prisma.persons.deleteMany({
        where: { codeAlert: alertId },
      });
    }
    createHistoryRecord(
      alertId,
      updatedAlert.createdById,
      'SEND',
     `L'alerte a été envoyée par l'utilisateur.`
    )
    // Revalidate the cache for the alert page
    revalidatePath("/alerte");
    return updatedAlert;
  } catch (error) {
    console.error("Error updating alert:", error);
    throw new Error("Failed to update alert");
  }
}

// Helper function to handle audio upload
async function uploadAudio(audioFile: File): Promise<string> {
  const arrayBuffer = await audioFile.arrayBuffer();
  const fileContent = Buffer.from(arrayBuffer);

  // Assuming uploadFile handles Cloudflare R2 uploads
  const uploadResponse = await uploadFile(fileContent, audioFile.name, audioFile.type);
  return getFileUrl(uploadResponse.Key); // Assuming Key contains the file name
}
export async function createHistoryRecord(
  alertId: string,
  userId: string | null,
  action: string,
  details?: string
): Promise<AlertHistory> {
  try {
    return await prisma.alertHistory.create({
      data: {
        alertId,
        userId,
        action,
        details: details || null,
      },
    });
  } catch (error) {
    console.error('Error creating history record:', error);
    throw new Error('Failed to create history record');
  }
}



export async function saveQr(
  userId: string,
  qrSecret:string,
) {
  try { 
    const updatedAlert = await prisma.user.update({
      where: { id: userId },
      data: {
        qrSecret,
      }
    })
    return updatedAlert
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
export async function AssignAlertAdmin(
  analysteId: string,
  responsableId:string,
  alertId:string,
  adminId:string,
) {
  try { 
      const updatedAlert = await prisma.alert.update({
        where: { id: alertId },
        data: {
          assignedAnalystId: analysteId,
          ...(responsableId && { assignedResponsableId: responsableId }),
          adminStatus: "ASSIGNED",
        },
      });
      createHistoryRecord(
        alertId,
        adminId,
        'ASSIGN_ADMIN',
       `L'admin s'est assigné cette alerte`
      )
      return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}


export async function saveConclusion(
  userId: string,
  content:string,
  alertId:string,
  recevable:RecevalbeStatus,
  criticite:string,
  decision:UserAlertStatus,
) {
  try { 
    if(recevable === "RECEVALBE")
    {
      const updatedAlert = await prisma.conclusion.create({
        data: {
          content,
          alertId,
          createdById:userId,
          
        }
      })
      const res = await prisma.alert.update({
        where:{id:alertId},
        data:{
          analysteValidation:decision,
          recevable:recevable,
          criticite:parseInt(criticite),
        }
      })
      createHistoryRecord(
        alertId,
        userId,
        'SET_STATUS',
       `L'alerte a été rendue recevable par l'analyste et transmise au responsable pour décision.`
      )
      return {updatedAlert,res}
    }else{
      const updatedAlert = await prisma.conclusion.create({
        data: {
          content,
          alertId,
          createdById:userId,
          
        }
      })
      const res = await prisma.alert.update({
        where:{id:alertId},
        data:{
          analysteValidation:"DECLINED",
          recevable:recevable,
          criticite:parseInt(criticite),
        }
      })
      createHistoryRecord(
        alertId,
        userId,
        'SET_STATUS',
       `L'alerte a été jugée non recevable par l'analyste et transmise au responsable pour information.`
      )
      return {updatedAlert,res}
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}

