/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { compare } from "bcrypt";

export async function GetAnalyste() {
  try {
    const user = await prisma.user.findMany({
      where: { role: "ANALYSTE" },
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
export async function GetResponsable() {
  try {
    const user = await prisma.user.findMany({
      where: { role: "RESPONSABLE" },
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

export async function ArchiverUser(
  id: string,
): Promise<string> {
  // Validate that new password matches the confirmation

  // Fetch the user from the database
  const admin = await prisma.user.findUnique({ where: { id } });
  if (!admin) {
    throw new Error("User not found or password is missing.");
  }
  if(admin.statut === true){
    throw new Error("User not found or password is missing.");
  }
  try {
    await prisma.user.update({
      where: { id },
      data: { archive: true },
    });

    return "Utilisateur archivé";
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An unexpected error occurred while updating the password."
    );
  }
}

export async function DesarchiverUser(
  id: string,
): Promise<string> {
  // Validate that new password matches the confirmation

  // Fetch the user from the database
  const admin = await prisma.user.findUnique({ where: { id } });
  if (!admin) {
    throw new Error("User not found or password is missing.");
  }
 
  try {
    await prisma.user.update({
      where: { id },
      data: { archive: false },
    });

    return "Utilisateur désarchivé";
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An unexpected error occurred while updating the password."
    );
  }
}

export async function changeAdminPassword(
  id: string,
  oldPassword: string,
  newPassword: string,
  confirmedPassword: string
): Promise<string> {
  // Validate that new password matches the confirmation
  if (newPassword !== confirmedPassword) {
    throw new Error("New password and confirmed password do not match.");
  }

  // Validate password strength
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long.");
  }

  // Fetch the user from the database
  const admin = await prisma.user.findUnique({ where: { id } });

  if (!admin || !admin.password) {
    throw new Error("User not found or password is missing.");
  }

  // Verify the old password
  const isMatch = await compare(oldPassword, admin.password); // Ensure `compare` is awaited
  if (!isMatch) {
    throw new Error("Old password does not match.");
  }

  // Hash the new password
  const hashedPassword = await hash(newPassword, 10);

  // Update the password in the database
  try {
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return "Password updated successfully.";
  } catch (error: any) {
    throw new Error(
      error.message ||
        "An unexpected error occurred while updating the password."
    );
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
        qrSecret:true,
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

export async function saveJustif(
  alertId: string,
  content: string,
  files: File[] | null
) {
  try {
    const imageUrls: string[] = [];

    if (files) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const fileContent = Buffer.from(arrayBuffer);
        const uploadResponse = await uploadFile(fileContent, file.name, file.type);
        const imageUrl = getFileUrl(uploadResponse.Key); // assuming Key is the filename
        imageUrls.push(imageUrl);
      }
    }

    // Create the Justif record
    const newJustif = await prisma.justif.create({
      data: {
        alertId,
        content,
        files: {
          create: imageUrls.map((url) => ({
            url, // assuming FileJustif has a `url` field
          })),
        },
      },
      include: {
        files: true,
      },
    });
    const updatedAlert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        status: "EN_COURS_TRAITEMENT",
      },
    });
    return newJustif;
  } catch (error) {
    console.error("Error saving justification:", error);
    throw new Error("Failed to save justification");
  }
}
