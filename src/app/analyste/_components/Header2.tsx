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

import { redirect, usePathname } from "next/navigation";
import { NavUser } from "./nav-user";
import { KeySquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import {
  BookOpen,
  House,
  Settings2,
  SwatchBook,
  BookMarked,
  FolderLock,
} from "lucide-react";
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
const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home"; // Extract last segment
  const { data } = useSession();
  const page = navMain.find(
    (cat) => cat.url === lastSegment
  );
  return (
    <header className="flex h-16 lg:rounded-t-lg shrink-0 bg-white dark:bg-slate-900 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                {page?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="lg:pr-10 w-1/2 flex items-center justify-end gap-4">
        
        <DarkModeSwitcher />
        <div>
          {data?.user ? (
            <NavUser />
          ) : (
            <div>
              <Button
                onClick={() => redirect("/user")}
                className=" gap-2.5 px-12"
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
