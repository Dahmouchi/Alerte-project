/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  prisma  from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
  try {
    const id = (await params).id;
    if (!id) return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });

    const data = await req.json();
    const updatedAlert = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Error updating alert" }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
