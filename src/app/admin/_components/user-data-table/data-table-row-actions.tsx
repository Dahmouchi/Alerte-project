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

import { Archive, Copy, MoreHorizontal, Pencil } from "lucide-react";
import {  userSchema  } from "@/lib/validations/schema";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditDialog from "@/app/admin/_components/modals/edit-modal";
import ArchiveModal from "../modals/archive-modal";
import { useSession } from "next-auth/react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [dialogContent, setDialogContent] =
    React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const task = userSchema.parse(row.original);
  const {data:session} = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleEditClick = () => {
    setDialogContent(<EditDialog user={task} onClose={() => setIsOpen(false)}/>);
  };
  return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Copier ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <DialogTrigger asChild onClick={handleEditClick}>
            <DropdownMenuItem>
              <Pencil className='mr-2 h-4 w-4' />
              Modifier
            </DropdownMenuItem>
          </DialogTrigger>
          {session?.user.id !== task.id && 
          <DropdownMenuItem
          onSelect={() => setShowDeleteDialog(true)}
          
        >
          <Archive className='mr-2 h-4 w-4' />
          Archiver
        </DropdownMenuItem>
        }
          
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <ArchiveModal
        task={task}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />
    </Dialog>
  );
}
