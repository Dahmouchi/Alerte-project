"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

// * * This is just a demostration of delete modal, actual functionality may vary

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
import { UserType } from "@/lib/validations/schema";
  import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

  type DeleteProps = {
    task: UserType;
    isOpen: boolean;
    showActionToggle: (open: boolean) => void;
  };
  
  export default function DeleteDialog({
    task,
    isOpen,
    showActionToggle,
  }: DeleteProps) {
    const router = useRouter();
      const handleDelete = async (id: string) => {
        try {
          await axios.delete(`/api/users/${id}`);
          toast.success("L'élément a été supprimé avec succès");
          // Refresh data or update state after deletion
          router.refresh();
        } catch (error) {
          toast.error("Failed to delete item");
        }
      };
    return (
      <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to delete Task
              Details of <b>{task.username}</b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={() => { 
                handleDelete(task.id);
                showActionToggle(false);
               
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }