/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  BookOpen,
  House,
  Settings2,
  SwatchBook,
  BookMarked,
  FolderLock,
  Bell,
  Check,
} from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { NavUser } from "./nav-user";
import { ChevronDown, KeySquare, LayoutDashboard, UserCheck, UserCog } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { markAsAllReadNotification, markAsReadNotification } from "@/actions/notifications";
import axios from "axios";
import { io } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
const navMain = [
   
  {
    title: "Accueil",
    url: "overview",
    icon: House,
    
  },
  {
    title: "Toutes les Alertes",
    url: "alertes",
    icon: SwatchBook,
    
  },
  {
    title: "Mes Alertes",
    url: "myAlertes",
    icon: BookMarked,
  },
  {
    title: "Alertes clôturées",
    url: "cloture",
    icon: FolderLock,
  },
  {
    title: "Documentation",
    url: "documentation",
    icon: BookOpen,
   
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings2,
    
  },
]
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedId:string;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}
const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home"; // Extract last segment
  const { data: session, update } = useSession();
  const router = useRouter()
  const page = navMain.find(
    (cat) => cat.url === lastSegment
  );
   const [message, setMessage] = useState("");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    // Filter unread notifications or limit to 5
    const displayedNotifications = showAll 
      ? notifications 
      : notifications.slice(0, 3);
      
    useEffect(() => {
      const socket = io("https://bizlist-notifications-server.1ulq7p.easypanel.host");
      socket.on("notifyUser", (message) => {
        setMessage(message);
      });
      // Cleanup function to remove the event listener
      return () => {
        socket.off("notifyUser");
        socket.disconnect();
      };
    }, []);
  
    // Fetch initial notifications
    useEffect(() => {
  
      const fetchNotifications = async () => {
        try {
          const res = await axios.get(`/api/notifications/${session?.user.id}`);
        ;
          setNotifications(res.data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchNotifications();
    }, [session?.user?.id,message,message]);
  
  
    const red = async (notificationId: string,alertId:string)=>{
      await markAsRead(notificationId);
      redirect(`/responsable/dashboard/alertes/${alertId}`)
    }
    const markAsRead = async (notificationId: string) => {
      try {
        await markAsReadNotification(notificationId)
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId 
              ? { ...n, read: true, readAt: new Date() } 
              : n
          )
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    };
  
    const markAllAsRead = async () => {
      try {
  
        if(session){
          await markAsAllReadNotification(session.user?.id)
        }
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true, readAt: new Date() }))
        );
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    };
  const handleDashboardSwitch = async (path: string) => {
    try {
      console.log("old result",session)
      // First update the session
      await update({
        twoFactorVerified: false,
      });
     console.log("new result",session)
      // Then redirect
      router.push(path);
    } catch (error) {
      console.error("Dashboard switch failed:", error);
      toast.error("Échec de la mise à jour de sécurité");
    }
  }
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex h-16 rounded-t-lg shrink-0 bg-white dark:bg-slate-900 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
  <div className="flex items-center gap-2 px-4">
    <SidebarTrigger className="-ml-1 cursor-pointer" />
    <Separator orientation="vertical" className="mr-2 h-4 dark:bg-slate-50" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="">
          <BreadcrumbLink href="/">Alert Application</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize hidden lg:block">
            {page?.title || lastSegment}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </div>
  <div className="lg:pr-10 w-1/2 flex items-center justify-end gap-4">
    {/* Dashboard Switcher - Only show if user has both roles */}
    {(session?.user.role === "ADMIN_RESPONSABLE") && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="gap-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800">
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden md:inline">Tableaux de bord</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>Changer de vue</DropdownMenuLabel>
      <DropdownMenuSeparator />
        <DropdownMenuItem
         onClick={() => handleDashboardSwitch("/admin/login")}
          className="cursor-pointer "
        >
          <UserCog className="mr-2 h-4 w-4" />
          Vue Admin
        </DropdownMenuItem>
      {session?.user.role === "ADMIN_RESPONSABLE" && (
        <DropdownMenuItem 
        onClick={() => handleDashboardSwitch("/responsable/login")}
          className="cursor-pointer bg-blue-100"
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Vue Responsable
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
    )}
    
    <DarkModeSwitcher />
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive" 
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  markAllAsRead();
                }}
              >
                Mark all as read
              </Button>
            </div>
            
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading notifications...
              </div>
            ) : (
              <div className="">
              <div className={`max-h-[400px] ${showAll ? "overflow-y-auto" : ""}`}>
                {displayedNotifications.length > 0 ? (
                  displayedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => red(notification.id, notification.relatedId)}
                      className={`flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-accent ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex justify-between w-full">
                        <h4 className="font-medium">
                          {notification.title === "Assignment notification" 
                            ? "Notification d'assignation" 
                            : notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message === "l'administration assigner a vous une alerte"
                          ? "L'administration vous a assigné une alerte"
                          : notification.message}
                      </p>
                      <div className="flex justify-between w-full items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr // French relative time (e.g., "il y a 5 minutes")
                          })}
                        </span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucune notification trouvée
                  </div>
                )}
              </div>
                <div className="border-t p-2 text-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Afficher moins" : "Afficher toutes les notifications"}
                  </Button>
                </div>
              
            </div>
            )}
            
          </DropdownMenuContent>
        </DropdownMenu>
    <div>
      {session?.user ? (
        <NavUser />
      ) : (
        <div>
          <Button
            onClick={() => redirect("/user")}
            className="gap-2.5 px-12"
          >
            <KeySquare /> S&apos;Identifier
          </Button>
        </div>
      )}
    </div>
  </div>
</header>
  );
};

export default Header;
