"use client";

import type * as React from "react";
import {
  BookOpen,
  House,
  BellElectric,
  Settings2,
  SwatchBook,
  BookMarked,
  FolderLock,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  
} from "@/components/ui/sidebar";
import Image from "next/image";


// This is sample data.
const datas = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Alert Application",
      logo: BellElectric,
      plan: "Dark Mode",
    },
  ],
  navMain: [
   
    {
      title: "Accueil",
      url: "/analyste/dashboard/overview",
      icon: House,
      
    },
    {
      title: "Toutes les Alertes",
      url: "/analyste/dashboard/alertes",
      icon: SwatchBook,
      
    },
    {
      title: "Mes Alertes",
      url: "/analyste/dashboard/myAlertes",
      icon: BookMarked,
    },
    {
      title: "Alertes clôturées",
      url: "/analyste/dashboard/cloture",
      icon: FolderLock,
    },
    {
      title: "Documentation",
      url: "/analyste/dashboard/documentation",
      icon: BookOpen,
     
    },
    {
      title: "Settings",
      url: "/analyste/dashboard/settings",
      icon: Settings2,
      
    },
  ],

};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
   <Sidebar collapsible="icon" {...props} className="bg-slate-200 dark:bg-slate-800 p-2">
         <SidebarHeader className="dark:bg-slate-900 flex items-center justify-center p-2 bg-white rounded-t-xl shadow-lg">
           <Image src={"/logo.png"} alt="logo" width={300} height={200}/>
         </SidebarHeader>
         <SidebarContent className="dark:bg-slate-900 pt-4 pl-0 bg-white rounded-b-xl">
           <NavMain items={datas.navMain} />
         </SidebarContent>
         <SidebarRail />
       </Sidebar>
  );
}
