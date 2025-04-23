/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/notifications.tsx
"use client";
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Bell } from 'lucide-react';

export function Notifications({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`/api/notifications?userId=${userId}`);
    
    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      if (newNotification.userId === userId) {
        setNotifications((prev: any) => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    return () => eventSource.close();
  }, [userId]);

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full">
          {unreadCount}
        </Badge>
      )}
    </div>
  );
}