/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  prisma  from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
  try {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });

    const updatedAlert = await prisma.notification.findMany({
      where: { userId:id },
      orderBy:{
        createdAt:"desc",
      }
    });

    return NextResponse.json(updatedAlert);
  } catch (error) {
    return NextResponse.json({ error: "Error updating alert" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
    try {
      const id = (await params).id;
      if (!id) return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
  
      const data = await req.json();
      const updatedAlert = await prisma.conclusion.update({
        where: { id },
        data,
      });
  
      return NextResponse.json(updatedAlert);
    } catch (error) {
      return NextResponse.json({ error: "Error updating alert" }, { status: 500 });
    }
  }


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
    try {
      const id = (await params).id;
    if (!id) {
      return NextResponse.json(
        { error: "L'ID est requis" }, // "ID is required" in French
        { status: 400 }
      );
    }

    // 1. First find the conclusion to get the associated alert ID
    const conclusion = await prisma.conclusion.findUnique({
      where: { id },
      select: { alertId: true }
    });

    if (!conclusion) {
      return NextResponse.json(
        { error: "Conclusion non trouvée" }, // "Conclusion not found"
        { status: 404 }
      );
    }

    // 2. Update the alert before deletion
    await prisma.alert.update({
      where: { id: conclusion.alertId },
      data: { 
        updatedAt: new Date(), // Always update the timestamp
        recevable:"NON_DECIDE",
        analysteValidation:"PENDING",
        criticite:1,
        // Add any specific alert updates needed
        // For example, if you track conclusion status:
        // status: "CONCLUSION_DELETED"
      }
    });

    // 3. Now delete the conclusion
    await prisma.conclusion.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: "Conclusion supprimée avec succès" }, // "Conclusion deleted successfully"
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { error: "Échec de la suppression de la conclusion" }, // "Failed to delete conclusion"
      { status: 500 }
    );
  }
}