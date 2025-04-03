"use server";

import prisma from "@/lib/prisma";


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