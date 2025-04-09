/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextAuth'

// GET - Get chat messages
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
  const alertId =  (await params).id;
  const user = await getServerSession(authOptions);
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const chat = await prisma.alertChat.findFirst({
    where: { alertId: alertId },
    include: {
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  if (!chat) {
    return NextResponse.json({ messages: [] })
  }

  return NextResponse.json(chat)
}
// POST - Send new message
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: any }>; }) {
  const alertId =  (await params).id;
  const user = await getServerSession(authOptions);
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, attachments = [] } = await req.json()

  // Find or create chat
  let chat = await prisma.alertChat.findFirst({
    where: { alertId: alertId }
  })

  if (!chat) {
    chat = await prisma.alertChat.create({
      data: { alertId: alertId }
    })
  }

  // Create message
  const message = await prisma.chatMessage.create({
    data: {
      chatId: chat.id,
      senderId: user.user.id,
      content,
      attachments
    },
    include: {
      sender: { select: { id: true, name: true, role: true } }
    }
  })

  return NextResponse.json(message)
}