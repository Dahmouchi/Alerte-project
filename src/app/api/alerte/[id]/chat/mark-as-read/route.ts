/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/alerts/[alertId]/chat/mark-as-read/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'

export async function POST(
 req: NextRequest, { params }: { params: Promise<{ id: any }>; }
) {
  const alertId =(await params).id;
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Mark all unread messages as read
    await prisma.chatMessage.updateMany({
      where: {
        chat: {
          alertId: alertId
        },
        isRead: false,
        senderId: {
          not: session.user.id // Don't mark your own messages
        }
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}