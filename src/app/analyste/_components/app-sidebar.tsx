"use client";

import type * as React from "react";
import {
  BookOpen,
  House,
  BellElectric,
  Settings2,
  AlertCircle,
} from "lucide-react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
      url: "/analyste/dashboard/alertes",
      icon: House,
      
    },
    {
      title: "Votre Alertes",
      url: "/analyste/dashboard/myAlertes",
      icon: AlertCircle,
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
     
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className=" flex items-center justify-center p-4">
        <Image src={"/logo.png"} alt="logo" width={300} height={200}/>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <NavMain items={datas.navMain} />
      </SidebarContent>

      <SidebarFooter>
      
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
