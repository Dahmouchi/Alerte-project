"use client";

import type * as React from "react";
import {
  BookOpen,
  Siren,
  House,
  BellElectric,
  Settings2,
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
      url: "/user/dashboard",
      icon: House,
      
    },
    {
      title: "Create Alert",
      url: "/user/dashboard/alerte/create",
      icon: Siren,
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
     
    },
    {
      title: "Settings",
      url: "/user/dashboard/settings",
      icon: Settings2,
      
    },
  ],

};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="dark:bg-slate-800 flex items-center justify-center p-4">
        <Image src={"/logo.png"} alt="logo" width={300} height={200}/>
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-800 pt-4">
        <NavMain items={datas.navMain} />
      </SidebarContent>

      <SidebarFooter>
      
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
