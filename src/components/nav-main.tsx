"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation"; // Import to get current route
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import clsx from "clsx"; // Utility for conditional classNames

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname(); // Get the current route

  // Function to remove the language prefix ("/fr" or "/en") from pathname
  const getPathWithoutLocale = (path: string) => {
    return path.replace(/^\/(fr|en)/, ""); // Removes the "/fr" or "/en" prefix
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
          getPathWithoutLocale(pathname) === item.url ||
          (item.url !== "/user/dashboard" && getPathWithoutLocale(pathname).startsWith(item.url));
        
          return (
            <Collapsible key={item.title} asChild  className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={clsx(
                        "cursor-pointer transition-all duration-200",
                        isActive ? "bg-blue-500 dark:bg-blue-800 text-white font-semibold" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
