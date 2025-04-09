/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/alerts/[alertId]/chat/unread/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth';

export async function GET(
  req: NextRequest, { params }: { params: Promise<{ id: any }>; }
) {
  const alertId = (await params).id;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const count = await prisma.chatMessage.count({
    where: {
      chat: {
        alertId: alertId
      },
      isRead: false,
      senderId: {
        not: session.user.id // Don't count your own messages
      }
    }
  });

  return NextResponse.json({ count });
}