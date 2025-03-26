/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";

export async function updateAlert(
  alertId: string,
  formData: any,
  step: number,
  persons: { nom?: string; prenom?: string ;fonction?:string}[],
  files: File[],
  anonymeUser: string,
  type: string,
  anonyme: boolean,
  selectedCategory:string,

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
        }, // Ensure date is valid
        step,
        contactPreference:anonymeUser,
        involved:anonyme,
        category:selectedCategory,
        type,
        status:"EN_COURS_TRAITEMENT"
        
      },
    });

    // Insert persons linked to the alert
   if(anonyme){
    if (persons.length > 0) {
      await prisma.persons.createMany({
        data: persons.map((person) => ({
          codeAlert: alertId, // Link person to the alert
          nom: person.nom || null,
          prenom: person.prenom || null,
          fonction: person.fonction || null,
        })),
        skipDuplicates: true, // Avoid inserting duplicates
      });
    }
   }else{
    await prisma.persons.deleteMany({
      where: { codeAlert: alertId },
    });
   }

    revalidatePath("/alerte"); // Revalidate cache
    return updatedAlert;
  } catch (error) {
    console.error("Error updating alert:", error);
    throw new Error("Failed to update alert");
  }
}

export async function UserInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to retrieve user info");
  }
}
