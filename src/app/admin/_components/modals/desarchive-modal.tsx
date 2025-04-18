"use client";
import { DesarchiverUser } from "@/actions/user";
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
import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type DeleteProps = {
  task: UserType;
  isOpen: boolean;
  showActionToggle: (open: boolean) => void;
};

export default function ArchiveModal({
  task,
  isOpen,
  showActionToggle,
}: DeleteProps) {
  const router = useRouter();
  const handleDelete = async (id: string) => {
    try {
      const test = await DesarchiverUser(id);
      toast.success(test);
      // Refresh data or update state after deletion
      router.refresh();
    } catch (error) {
      toast.error("Désactivation réquise");
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={showActionToggle}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Êtes-vous sûr de vouloir désarchiver cet utilisateur ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action restaurera l&apos;utilisateur <b>{task.username}</b> et
            le rendra de nouveau actif dans le système.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="bg-green-600 hover:bg-green-500"
            onClick={() => {
              handleDelete(task.id);
              showActionToggle(false);
            }}
          >
            <Archive />
            Désarchiver
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
