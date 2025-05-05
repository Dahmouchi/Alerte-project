/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function Component(session:any) {
 
  return (
    <div className="mx-auto px-2 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center lg:justify-normal justify-between px-4 md:px-6">

        
        <div className="ml-auto -2 ">
          <div className=" flex items-center gap-1">
          <DarkModeSwitcher /> 
            {session.session && 
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button
                 className="bg-transparent hover:bg-transparent cursor-pointer"
               >
                 <Avatar className="h-8 w-8 rounded-lg">
                   <AvatarImage src={session.session?.user.image || "/profile.png"} alt={"user.name"} />
                 </Avatar>
                             
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent
               className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
               side={"bottom"}
               align="end"
               sideOffset={4}
             >
               <DropdownMenuLabel className="p-0 font-normal">
                 <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                   <Avatar className="h-8 w-8 rounded-lg">
                    
                     <AvatarFallback className="rounded-lg">   {session.session?.user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">
                       {session.session?.user.name || "Utilisateur"}
                     </span>
                     <span className="truncate text-xs">
                       {session.session?.user.email || "vous êtes connecté"}
                     </span>
                   </div>
                 </div>
               </DropdownMenuLabel>
 
               <DropdownMenuSeparator />
               <DropdownMenuItem
                 onClick={() => signOut({ callbackUrl: "/admin/login" })}
                 className="cursor-pointer"
               >
                 <LogOut />
                 Log out
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
            }
               
          </div>
        </div>

      </header>
    </div>
  );
}
