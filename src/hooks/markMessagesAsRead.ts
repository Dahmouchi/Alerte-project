// lib/api/chat.ts

import axios from "axios"

export async function markMessagesAsRead(alertId: string) {
  try {
    const response = await axios.post(`/api/alerte/${alertId}/chat/mark-as-read`)
    return response.data
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}