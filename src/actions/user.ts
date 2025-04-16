/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

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