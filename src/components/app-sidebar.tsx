"use client";

import type * as React from "react";
import {
  BookOpen,
  House,
  BellElectric,
  Settings2,
  File,
  SendHorizonal,
  LogOut,
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
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";


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
      title: "Créer alerte",
      url: "/user/dashboard/alerte/create",
      icon: SendHorizonal,
    },
    {
      title: "Brouillons",
      url: "/user/dashboard/alerte/draft",
      icon: File,
    },
    {
      title: "Documentation",
      url: "/user/dashboard/documentation",
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
    <Sidebar collapsible="icon" {...props} className="bg-white dark:bg-slate-800 p-2">
      <SidebarHeader className="dark:bg-slate-900 flex items-center justify-center p-2 bg-white rounded-t-xl ">
        <Image src={"/logo.png"} alt="logo" width={300} height={200}/>
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-900 pt-4 pl-0 bg-white rounded-b-xl">
        <NavMain items={datas.navMain} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <Button
          onClick={() => signOut({ callbackUrl: "/user/login" })}
          className="cursor-pointer flex justify-start w-full text-start bg-white text-slate-800 shadow-md transition-all rounded-lg duration-200 py-5 hover:bg-blue-600 dark:bg-slate-800 dark:text-white hover:text-white dark:hover:bg-gray-800"
        >
          <div>
            {" "}
            <LogOut
             className="w-4 h-4" />
          </div>
          <span>Déconnexion</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
