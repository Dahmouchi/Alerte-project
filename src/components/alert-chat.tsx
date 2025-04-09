/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'
import axios from 'axios'
import { Skeleton } from './ui/skeleton'
import { format, toZonedTime } from "date-fns-tz";
import { fr } from 'date-fns/locale'

export function AlertChat({ alertId }: { alertId: string }) {
  const [messages, setMessages] = useState<any>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    
    // Set up polling or consider WebSockets for real-time updates
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [alertId])

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/alerte/${alertId}/chat`)
      const data = await res.json()
      setMessages(data.messages || [])
      setIsLoading(false)
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }
  const formatFrenchDate = (isoString: any) => {
    const parisTime = toZonedTime(isoString, "Europe/Paris");
    return format(parisTime, "dd/MM/yyyy à HH:mm", {
      timeZone: "Europe/Paris",
      locale: fr,
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const res = await axios.post(`/api/alerte/${alertId}/chat`, {
        content: newMessage
      })
      
      if (res.status===200) {
        setNewMessage('')
        fetchMessages() // Refresh messages
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="flex flex-col h-full">
   
    <ScrollArea className="flex-1 overflow-y-auto">
      {isLoading ? (
          <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center py-4">No messages yet</div>
        </div>
      ) : (
        <ScrollArea className="flex-1 max-h-[50vh] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div 
              key={message.id}
              className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.senderId === session?.user?.id ? 'bg-blue-600 text-primary-foreground' : 'bg-muted'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={message.sender.image} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{message.sender.name}</span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatFrenchDate(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        </ScrollArea>
      )}
    </ScrollArea>
    
    {/* Input area fixed at bottom */}
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
          Send
        </Button>
      </div>
    </div>
  </div>
  )
}