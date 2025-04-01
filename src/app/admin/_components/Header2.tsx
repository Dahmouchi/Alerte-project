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

const Header = () => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home"; // Extract last segment
  const { data } = useSession();

  return (
    <header className="flex h-16 rounded-t-lg shrink-0 bg-white dark:bg-slate-900 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4 dark:bg-slate-50" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">Alert Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize">
                {lastSegment}
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
