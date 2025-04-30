// hooks/useUnreadMessages.ts
import axios from 'axios';
import { useEffect, useState } from 'react';

export function useUnreadMessages(alertId: string) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial unread count
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`/api/alerte/${alertId}/chat/unread`);
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch unread messages:', error);
      }
    };

    fetchUnreadCount();

    // Set up polling (or use WebSockets for real-time updates)
    const interval = setInterval(fetchUnreadCount, 60000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [alertId]);

  return unreadCount;
}