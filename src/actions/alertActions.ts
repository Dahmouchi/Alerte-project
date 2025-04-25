/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { nanoid } from "nanoid"; // Generate unique codes
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import { AlertHistory, RecevalbeStatus, UserAlertStatus } from "@prisma/client";
import { io } from "socket.io-client";
import { sendAlertNotification } from "./notifications";
import sendEmail from "./sendemail";

export async function createAlerte(
  category: string,
  createdById: string,
){
  try{
    if(category || createdById ){
      const newAlert = await prisma.alert.create({
        data: {
          code: nanoid(8), // Generate an 8-character unique code
          category,
          createdById,
          step: 1, // Start at step 1
        },
      });
      createHistoryRecord(
        newAlert.id,
        createdById,
        'CREATE',
       `L'alerte a été créée par l'utilisateur.`
      )
      return newAlert
    }else{
      console.error("Error category or createby:");
      throw new Error("Failed to update alert");
    }
  }catch(error){
    console.error("Error updating alert:", error);
    throw new Error("Failed to update alert");
  }
}
export async function updateAlert(
  alertId: string,
  formData: any,
  step: number,
  persons: { nom?: string; prenom?: string; fonction?: string }[],
  files: File[], // This can be images and audio
  audioUrl: string | null, // New field for audio file
  anonymeUser: string,
  type: string,
  anonyme: boolean,
  selectedCategory: string
) {
  try {
    const imageUrls: string[] = [];
    if (files) {
      for (const image of files) {
        const arrayBuffer = await image.arrayBuffer();
        const fileContent = Buffer.from(arrayBuffer);
        const uploadResponse = await uploadFile(
          fileContent,
          image.name,
          image.type
        );
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
        status: "EN_COURS_TRAITEMENT",
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
    await sendAlertNotification(
      updatedAlert.code,
      "Une nouvelle alerte a été détectée dans le système."
    );
    createHistoryRecord(
      alertId,
      updatedAlert.createdById,
      "SEND",
      `L'alerte a été envoyée par l'utilisateur.`
    );
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
  const uploadResponse = await uploadFile(
    fileContent,
    audioFile.name,
    audioFile.type
  );
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
    console.error("Error creating history record:", error);
    throw new Error("Failed to create history record");
  }
}

export async function saveQr(userId: string, qrSecret: string) {
  try {
    const updatedAlert = await prisma.user.update({
      where: { id: userId },
      data: {
        qrSecret,
      },
    });
    return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
export async function AssignAlertAdmin(
  analysteId: string,
  responsableId: string,
  alertId: string,
  adminId: string
) {
  try {
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        assignedAnalystId: analysteId,
        ...(responsableId && { assignedResponsableId: responsableId }),
        adminStatus: "ASSIGNED",
      },
      include: {
        assignedAnalyst: true,
        assignedResponsable: true,
      },
    });
    if (analysteId) {
      const emailContentAnalyst = `
<html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05); overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4361ee, #3a0ca3); padding: 24px; text-align: center;">
        <h1 style="color: white; font-size: 22px; font-weight: 600; margin: 0;">Nouvelle Assignation</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 32px;">
        <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">Bonjour,</p>
        
        <div style="background-color: #f8fafc; border-left: 4px solid #4361ee; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
          <p style="font-size: 15px; color: #1e293b; margin: 0; font-weight: 500;">L'administrateur vous a assigné une nouvelle tâche nécessitant votre expertise.</p>
        </div>
        
        <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px;">Veuillez vous connecter à votre espace pour consulter les détails de cette assignation et prendre les mesures appropriées.</p>
        
        <a href="#" style="display: inline-block; background-color: #4361ee; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;">Accéder à mon espace</a>
      </div>
      
      <!-- Footer -->
      <div style="padding: 16px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #64748b; margin: 0;">
          Ceci est un message automatique. Merci de ne pas répondre à cet email.
          <br>
          © ${new Date().getFullYear()} Votre Organisation. Tous droits réservés.
        </p>
      </div>
    </div>
  </body>
</html>
      `;
      await prisma.notification.create({
        data: {
          userId: analysteId,
          title: "Assignment notification",
          message: "l'administration assigner a vous une alerte",
          type: "SYSTEM",
          relatedId: updatedAlert.code,
        },
      });
      await sendEmail(
        updatedAlert.assignedAnalyst?.email,
        `Nouvelle Assignation`,
        emailContentAnalyst
      );
    }
    if (responsableId) {
      const emailContentResponsalbe = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f5f7fa; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 30px auto; background: white; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4361ee, #3a0ca3); padding: 24px; text-align: center;">
              <h1 style="color: white; font-size: 22px; font-weight: 600; margin: 0;">Nouvelle Assignation</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px;">
              <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">Bonjour,</p>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #4361ee; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0;">
                <p style="font-size: 15px; color: #1e293b; margin: 0; font-weight: 500;">L'administrateur vous a assigné une nouvelle tâche nécessitant votre expertise.</p>
              </div>
              
              <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px;">Veuillez vous connecter à votre espace pour consulter les détails de cette assignation et prendre les mesures appropriées.</p>
              
              <a href="#" style="display: inline-block; background-color: #4361ee; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;">Accéder à mon espace</a>
            </div>
            
            <!-- Footer -->
            <div style="padding: 16px; text-align: center; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                Ceci est un message automatique. Merci de ne pas répondre à cet email.
                <br>
                © ${new Date().getFullYear()} Votre Organisation. Tous droits réservés.
              </p>
            </div>
          </div>
        </body>
      </html>
      `;
      await prisma.notification.create({
        data: {
          userId: responsableId,
          title: "Assignment notification",
          message: "l'administration assigner a vous une alerte",
          type: "SYSTEM",
          relatedId: updatedAlert.code,
        },
      });
      await sendEmail(
        updatedAlert.assignedResponsable?.email,
        `Nouvelle Assignation`,
        emailContentResponsalbe
      );
    }
    createHistoryRecord(
      alertId,
      adminId,
      "ASSIGN_ADMIN",
      `L'admin s'est assigné cette alerte`
    );
    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.emit("notifyUser");

    return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}

export async function saveConclusion(
  userId: string,
  content: string,
  content1: string,
  alertId: string,
  recevable: RecevalbeStatus,
  criticite: string,
  decision: UserAlertStatus
) {
  try {
    if (recevable === "RECEVALBE") {
      const updatedAlert = await prisma.conclusion.create({
        data: {
          content,
          alertId,
          createdById: userId,
          content1,
        },
      });
      const res = await prisma.alert.update({
        where: { id: alertId },
        data: {
          analysteValidation: decision,
          recevable: recevable,
          criticite: parseInt(criticite),
        },
      });
      if (res.assignedResponsableId) {
        await prisma.notification.create({
          data: {
            userId: res.assignedResponsableId,
            title: "Alerte traitée par l'analyste",
            message:
              "l'alerte a été traitée avec l'analyste et besoin de votre validation",
            type: "SYSTEM",
            relatedId: res.code,
          },
        });
      }
      const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
      socket.emit("notifyUser");
      createHistoryRecord(
        alertId,
        userId,
        "SET_STATUS",
        `L'alerte a été rendue recevable par l'analyste et transmise au responsable pour décision.`
      );
      return { updatedAlert, res };
    } else {
      const updatedAlert = await prisma.conclusion.create({
        data: {
          content,
          alertId,
          createdById: userId,
          content1,
        },
      });
      const res = await prisma.alert.update({
        where: { id: alertId },
        data: {
          analysteValidation: "DECLINED",
          recevable: recevable,
          criticite: 0,
        },
      });
      createHistoryRecord(
        alertId,
        userId,
        "SET_STATUS",
        `L'alerte a été jugée non recevable par l'analyste et transmise au responsable pour information.`
      );
      if (res.assignedResponsableId) {
        await prisma.notification.create({
          data: {
            userId: res.assignedResponsableId,
            title: "Alerte traitée par l'analyste",
            message:
              "l'alerte a été traitée avec l'analyste et besoin de votre validation",
            type: "SYSTEM",
            relatedId: res.code,
          },
        });
      }
      const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
      socket.emit("notifyUser");

      return { updatedAlert, res };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
export async function saveReponse(
  userId: string,
  content: string,
  alertId: string,
  involved: boolean,
) {
  try {
   
      const updatedAlert = await prisma.conclusion.create({
        data: {
          content,
          alertId,
          createdById: userId,
        },
      });
      const res = await prisma.alert.update({
        where: { id: alertId },
        data: {
          responsableValidation:"PENDING",
        },
      });
      createHistoryRecord(
        alertId,
        userId,
        "SET_STATUS",
        `L'alerte ${res.code} a été jugée non recevable par l'analyste et transmise au responsable pour information.`
      );
      if (res.assignedResponsableId) {
        await prisma.notification.create({
          data: {
            userId: res.assignedResponsableId,
            title: "Alerte traitée par l'analyste",
            message:
              "l'alerte a été traitée avec l'analyste et besoin de votre validation",
            type: "SYSTEM",
            relatedId: res.code,
          },
        });
      
      const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
      socket.emit("notifyUser");

      return { updatedAlert, res };
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
export async function saveDemande(userId: string, alertId: string) {
  try {
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: "TRAITE",
        analysteValidation: "APPROVED",
        responsableValidation: "PENDING",
      },
    });
    if (updatedAlert.assignedResponsableId) {
      await prisma.notification.create({
        data: {
          userId: updatedAlert.assignedResponsableId,
          title: "Alerte traitée par l'analyste",
          message:
            "l'alerte a été traitée avec l'analyste et besoin de votre validation",
          type: "SYSTEM",
          relatedId: updatedAlert.code,
        },
      });
    }

    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.emit("notifyUser");

    createHistoryRecord(
      alertId,
      userId,
      "DEMANDE_DE_VALIDATION",
      `L'analyste envyer une demande de validation`
    );
    return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
