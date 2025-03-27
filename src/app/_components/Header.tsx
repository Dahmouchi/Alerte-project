/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import { ArrowRight, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Component() {
  return (
    <div className="mx-auto px-2 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center lg:justify-normal justify-between px-4 md:px-6">
        <div className="lg:hidden">
          <DarkModeSwitcher />
        </div>
        <Link href="/" className="mr-6  lg:flex" prefetch={false}>
          <img src="/logo.png" alt="" className="w-56 h-auto" />
        </Link>
        <div className="ml-auto -2  hidden lg:block">
          <div className=" flex items-center gap-1">
            <DarkModeSwitcher />

            <Button asChild className="w-full sm:w-auto bg-blue-700 dark:text-white">
              <Link href="user">Crée un Profil</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto dark:bg-white dark:text-black">
              <Link href="/user/dashboard">
                S&apos;Identifier
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={"bottom"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/user/dashboard">
                    S&apos;Identifier
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Button asChild className="w-full sm:w-auto bg-blue-700 ">
                  <Link href="user" className="dark:text-white">Crée un Profil</Link>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
