/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { nanoid } from "nanoid"; // Generate unique codes
import { createHistoryRecord } from '@/actions/alertActions';

export async function POST(req: Request) {
  try {
    const { category, createdById } = await req.json();
    
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
    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Error creating alert ${error}`  }, { status: 500 });
  }
}

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      include: { createdBy: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
