/* eslint-disable @typescript-eslint/no-unused-vars */
import  prisma  from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params; // Ensure params is awaited
      if (!id) return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
  
      const data = await req.json();
      const updatedAlert = await prisma.alert.update({
        where: { id },
        data,
      });
  
      return NextResponse.json(updatedAlert);
    } catch (error) {
      return NextResponse.json({ error: "Error updating alert" }, { status: 500 });
    }
  }

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.alert.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
