
"use client";
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
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Component() {
 
  const { data } = useSession();

  return (
    <div className="mx-auto px-2 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center lg:justify-normal justify-between px-4 md:px-6">
      <Link
          href={"/"}
          className="retour-button"
          aria-label="Return to previous page"
        >
          <svg
            className="retour-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="retour-text">Retour</span>
        </Link>
        <div></div>
        <div className="ml-auto -2 ">
          <div className=" flex items-center gap-1">
            {data?.user && 
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button
                 className="bg-transparent hover:bg-transparent cursor-pointer"
               >
                 <Avatar className="h-8 w-8 rounded-lg">
                   <AvatarImage src={data?.user.image || "/profile.png"} alt={"user.name"} />
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
                    
                     <AvatarFallback className="rounded-lg">   {data?.user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-semibold">
                       {data?.user.name || "Utilisateur"}
                     </span>
                     <span className="truncate text-xs">
                       {data?.user.email || "vous êtes connecté"}
                     </span>
                   </div>
                 </div>
               </DropdownMenuLabel>
 
               <DropdownMenuSeparator />
               <DropdownMenuItem
                 onClick={() => signOut({ callbackUrl: "/analyste/login" })}
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
