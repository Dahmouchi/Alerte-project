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

import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { alertSchema  } from "@/lib/validations/schema";
import { Dialog } from "@/components/ui/dialog";
import DeleteDialog from "@/components/modals/delete-modal";
import Link from "next/link";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {

  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const task = alertSchema.parse(row.original);


  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[200px]'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(task.id)}
          >
            <Copy className='mr-2 h-4 w-4' />
            Copy Task ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
            <Link href={`/user/dashboard/alerte/create/${task.code}`}>
            <DropdownMenuItem>
              {" "}
              <Pencil className='mr-2 h-4 w-4' />
              Compléter la création
            </DropdownMenuItem>
            </Link>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className='text-red-600'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Details
          </DropdownMenuItem>
         
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        task={task}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />
    </Dialog>
  );
}
