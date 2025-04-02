/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, prenom, email, role,username } = body;

    // Validate input
    if (!name || !prenom || !email || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        prenom,
        email,
        role,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
    try {
      const alerts = await prisma.user.findMany({
        select: {
          createdAt: true,
        }
      });
  
      return NextResponse.json(alerts);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching alerts' }, { status: 500 });
    }
  }
  