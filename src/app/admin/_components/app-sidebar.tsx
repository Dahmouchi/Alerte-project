"use client";

import type * as React from "react";
import {
  House,
  BellElectric,
  Settings2,
  Users,
  Archive,
  SwatchBook,
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
import { Button } from "@/components/ui/button";
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
      url: "/admin/dashboard/overview",
      icon: House,
    },
    {
      title: "Toutes les Alertes",
      url: "/admin/dashboard/alertes",
      icon: SwatchBook,
    },
    {
      title: "Utilisateurs",
      url: "/admin/dashboard/users",
      icon: Users,
    },
    {
      title: "Archives utilisateurs",
      url: "/admin/dashboard/archive",
      icon: Archive,
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
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-white dark:bg-slate-800 p-2 flex flex-col items-center justify-center bg "
    >
      <SidebarHeader className="dark:bg-slate-800 flex items-center bg-white justify-center p-2 rounded-t-xl ">
        <Image src={"/logo.png"} alt="logo" width={300} height={200} />
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-800 pt-4 pl-0 bg-white rounded-b-xl">
        <NavMain items={datas.navMain} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="">
        <Button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="cursor-pointer flex justify-start w-full text-start bg-white text-slate-800 shadow-md transition-all rounded-lg duration-200 py-5 hover:bg-blue-600 dark:bg-slate-800 dark:text-white hover:text-white dark:hover:bg-gray-800"
        >
          <div>
            {" "}
            <LogOut className="w-4 h-4" />
          </div>
          <span>Déconnexion</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
