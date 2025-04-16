"use client";

import type * as React from "react";
import {
  House,
  BellElectric,
  Settings2,
  Users,
  AlertCircle,
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
      url: "/admin/dashboard/overview",
      icon: House,
      
    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "Alertes",
      url: "/admin/dashboard/alertes",
      icon: AlertCircle,
    },
    {
      title: "Settings",
      url: "/admin/dashboard/settings",
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
