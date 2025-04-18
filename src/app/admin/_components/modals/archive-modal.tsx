"use client";
import { ArchiverUser } from "@/actions/user";
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
      const test = await ArchiverUser(id);
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
            Êtes-vous sûr de vouloir archiver cet utilisateur ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Vous êtes sur le point
            d&apos;archiver l&apos;utilisateur <b>{task.username}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="bg-orange-400 hover:bg-orange-500"
            onClick={() => {
              handleDelete(task.id);
              showActionToggle(false);
            }}
          >
            <Archive />
            Archiver
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
