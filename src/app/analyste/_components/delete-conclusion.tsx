/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { AlertType } from "@/lib/validations/schema";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type DeleteProps = {
  task: any;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function DeleteConclusion({
  task,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/conclusion/${id}`);
      toast.success("Item deleted successfully");
      router.refresh();
      // Refresh data or update state after deletion
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Vous êtes sur le point de supprimer
            la conclusion :
            <br />
            <b>{task.content || "Sans titre"}</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
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
