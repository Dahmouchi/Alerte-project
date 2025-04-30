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
import { ElevenLabsClient } from 'elevenlabs';
import sharp from 'sharp';

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
    const quality = 80
    if (files) {
      for (const image of files) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${timestamp}-${image.name}`;
        const arrayBuffer = await image.arrayBuffer();
        const test = await sharp(arrayBuffer)
        .resize(1200)
        .jpeg({ quality }) // or .png({ compressionLevel: 9 })
        .toBuffer();
        
        const fileContent = Buffer.from(test);
      
        const uploadResponse = await uploadFile(
          fileContent,
          filename,
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
export const transformVoice = async (blob: Blob): Promise<Blob | undefined> => {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  try {
    const client = new ElevenLabsClient({ apiKey });
    const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // Your preferred voice ID

    const audioBlob = new Blob([await blob.arrayBuffer()], { 
      type: blob.type 
    });

    const audioStream = await client.speechToSpeech.convert(voiceId, {
      audio: audioBlob,
      model_id: "eleven_multilingual_sts_v2",
      output_format: "mp3_44100_128",
    });

    // Collect the stream data into chunks
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    
    // Combine all chunks into a single Blob
    const transformedBlob = new Blob(chunks, { type: 'audio/mp3' });
    
    return transformedBlob;

  } catch (error) {
    console.error('ElevenLabs error:', error);
    return undefined;
  }
};
// Helper function to handle audio upload
export async function uploadAudio(audioBlob: Blob): Promise<string> {
  try {
    // Create a filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `audio-recording-${timestamp}.webm`; // or .wav depending on your recorder
    
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const fileContent = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2
    const uploadResponse = await uploadFile(
      fileContent,
      filename, // Use our generated filename
      audioBlob.type || 'audio/webm' // Fallback MIME type
    );

    if (!uploadResponse?.Key) {
      throw new Error('Upload failed: No key returned');
    }

    return getFileUrl(uploadResponse.Key);
  } catch (error) {
    console.error('Audio upload error:', error);
    throw new Error('Failed to upload audio');
  }
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
export async function updateConclusion(conclusionId: string, content: string,criticite:number,alertId:string) {
  try {
    const updatedConclusion = await prisma.conclusion.update({
      where: { id: conclusionId },
      data: {
        content,
      },
    });
    await prisma.alert.update({
      where:{
         id:alertId,

      },
      data:{
        criticite:criticite,
      }
    })
    return updatedConclusion;
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
          <p style="font-size: 15px; color: #1e293b; margin: 0; font-weight: 500;">L'admin vous a assigné une nouvelle alerte nécessitant votre traitement.</p>
        </div>
        
        <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px;">Veuillez vous connecter à votre espace pour consulter les détails de l'alerte ${updatedAlert.code} et faire le nécessaire.</p>
        
        <a href="https://alerte-project.vercel.app/analyste" style="display: inline-block; background-color: #4361ee; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;">Accéder à mon espace</a>
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
          message: `l'admin vous a assigné l'alerte ${updatedAlert.code}`,
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
                <p style="font-size: 15px; color: #1e293b; margin: 0; font-weight: 500;">L'admin vous a assigné une nouvelle alerte nécessitant votre validation.</p>
              </div>
              
        <p style="font-size: 15px; color: #4b5563; margin-bottom: 24px;">Veuillez vous connecter à votre espace pour consulter les détails de l'alerte ${updatedAlert.code} et faire le nécessaire.</p>
              
              <a href="https://alerte-project.vercel.app/responsable" style="display: inline-block; background-color: #4361ee; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;">Accéder à mon espace</a>
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
          message: `l'admin vous a assigné l'alerte ${updatedAlert.code}`,
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
export async function updateConclusionWithAlerte(
  conId:string,
  userId: string,
  content: string,
  alertId: string,
  recevable: RecevalbeStatus,
  criticite: number,
) {
  try {
    if (recevable === "RECEVALBE") {
      const updatedAlert = await prisma.conclusion.update({
        where:{id:conId},
        data: {
          content,
        },
      });
      const res = await prisma.alert.update({
        where: { id: alertId },
        data: {
          analysteValidation: "INFORMATIONS_MANQUANTES",
          recevable: recevable,
          criticite: criticite,
        },
      });
     
      createHistoryRecord(
        alertId,
        userId,
        "UPDATE_STATUS",
        `L'alerte a été modifier recevable par l'analyste et transmise au responsable pour décision.`
      );
      return { updatedAlert, res };
    } else {
      const updatedAlert = await prisma.conclusion.update({
        where:{id:conId},
        data: {
          content,
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
        "UPDATE_STATUS",
        `L'alerte a été modifier jugée non recevable par l'analyste et transmise au responsable pour information.`
      );

      return { updatedAlert, res };
    }
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
          analysteValidation: decision,
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
            message: `l'alerte ${res.code} traitée et en attente de validation`,
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
          analysteValidation: decision,
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
            message: `l'alerte ${res.code} traitée et en attente de validation`,
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
          analysteValidation:"INFORMATIONS_MANQUANTES",
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
              `l'alerte ${res.code} traitée et en attente de validation`,
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
    const conclusion = await prisma.conclusion.create({
      data: {
        content:`Demande de clôture de l'alerte ${updatedAlert.code}`,
        alertId,
        analysteValidation:"APPROVED",
        createdById: userId,
      },
    });
    if (updatedAlert.assignedResponsableId) {
      await prisma.notification.create({
        data: {
          userId: updatedAlert.assignedResponsableId,
          title: "Alerte traitée par l'analyste",
          message:`Demande de clôture de l'alerte ${updatedAlert.code}`,
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
export async function AnnulerClo(conId:string,userId: string, alertId: string) {
  try {
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: "EN_COURS_TRAITEMENT",
        analysteValidation: "INFORMATIONS_MANQUANTES",
        responsableValidation: "PENDING",
      },
    });
    const conclusion = await prisma.conclusion.delete({
      where:{id:conId}
    });
    if(updatedAlert.assignedAnalystId){
      await prisma.notification.create({
        data: {
          userId: updatedAlert.assignedAnalystId,
          title: "Demande de clôture Annulée",
          message:
            `la demande de clôture de l'alerte ${updatedAlert.code} a été annuler par le responsable`,
          type: "SYSTEM",
          relatedId: updatedAlert.code,
        },
      });
    
    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.emit("notifyUser");
    }
    createHistoryRecord(
      alertId,
      userId,
      "ANNULER_LA_CLOTURE",
      `L'analyste annullé la demande de clôture`
    );
    return updatedAlert;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
