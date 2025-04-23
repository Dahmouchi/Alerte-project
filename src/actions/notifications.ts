"use server"
import prisma from "@/lib/prisma";
import { io } from 'socket.io-client';

export async function markAsReadNotification(
    notificationID: string,
  ) {
    try { 
      const updatedAlert = await prisma.notification.update({
        where: { id: notificationID },
        data: {
          read:true,
        }
      })
      return updatedAlert
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw new Error("Failed to retrieve user info");
    }
  }
  export async function markAsAllReadNotification(
    notificationID: string,
  ) {
    try { 
      const updatedAlert = await prisma.notification.updateMany({
        where: { userId: notificationID },
        data: {
          read:true,
        }
      })
      return updatedAlert
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw new Error("Failed to retrieve user info");
    }
  }


export async function sendAlertNotification(alertId: string, message: string) {
  try {
    // 1. Fetch all users with required roles
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'ANALYSTE', 'RESPONSABLE', 'ADMIN_RESPONSABLE'],
        },
      },
      select: {
        id: true,
      },
    });

    if (!users.length) {
      console.log("No users found with the required roles.");
      return;
    }

    // 2. Create a notification for each user
    const notifications = users.map(user => ({
      userId: user.id,
      title: "📢 Nouvelle alerte reçue !",
      message: message || "Une nouvelle alerte a été détectée dans le système.",
      type: "SYSTEM",
      relatedId: alertId,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    // 3. Emit socket event to notify all users
    const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
    socket.emit("notifyUser");


    console.log(`Successfully sent notifications to ${users.length} users.`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  } finally {
    await prisma.$disconnect();
  }
}
