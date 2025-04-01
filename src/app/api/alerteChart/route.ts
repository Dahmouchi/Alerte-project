/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
      const alerts = await prisma.alert.findMany({
        select: {
          createdAt: true,
        },
        orderBy:{
            createdAt:"asc"
        }
      });
  
      return NextResponse.json(alerts);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching alerts' }, { status: 500 });
    }
  }
  