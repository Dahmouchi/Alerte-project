"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Copy, Eye, History, MoreHorizontal } from "lucide-react";
import { alertSchema  } from "@/lib/validations/schema";
import { Dialog,  DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = alertSchema.parse(row.original);
  const router = useRouter();
  

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Ouvrir le menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(task.id)}
          >
            <Copy className='mr-2 h-4 w-4' />
            Copier ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={() => {router.push(`/admin/dashboard/alertes/${task.id}`)}}>
            <DropdownMenuItem>
              {" "}
              <Eye className='mr-2 h-4 w-4' />
              Voir détails
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => {router.push(`/admin/dashboard/alertes/histoire/${task.id}`)}}>
            <DropdownMenuItem>
              {" "}
              <History className='mr-2 h-4 w-4' />
              Historie
            </DropdownMenuItem>
          </DialogTrigger>
               
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
