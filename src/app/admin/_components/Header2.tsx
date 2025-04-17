/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
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

import { redirect, usePathname, useRouter } from "next/navigation";
import { NavUser } from "./nav-user";
import { ChevronDown, KeySquare, LayoutDashboard, UserCheck, UserCog } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home"; // Extract last segment
  const { data: session, update } = useSession();
  const router = useRouter()

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
            {lastSegment}
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
          className="cursor-pointer bg-blue-100"
        >
          <UserCog className="mr-2 h-4 w-4" />
          Vue Admin
        </DropdownMenuItem>
      {session?.user.role === "ADMIN_RESPONSABLE" && (
        <DropdownMenuItem 
        onClick={() => handleDashboardSwitch("/responsable/login")}
          className="cursor-pointer"
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Vue Responsable
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
    )}
    
    <DarkModeSwitcher />
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
