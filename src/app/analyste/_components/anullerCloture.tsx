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
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConclusion from "./delete-conclusion";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle2,
  FilePenLine,
  HelpCircle,
  MoreHorizontal,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AnnulerClo,
  saveConclusion,
  updateConclusion,
  updateConclusionWithAlerte,
} from "@/actions/alertActions";
import { useSession } from "next-auth/react";
type DeleteProps = {
  task: any;
  alerte: any;
  onClose: any;
};
const conclusionSchema = z.object({
  id: z.string(),
  recevableStatus: z.enum([
    "RECEVALBE",
    "NON_RECEVABLE",
    "NON_RECEVABLE_VALIDER",
    "NON_DECIDE",
  ]),
  commentaire: z.string(),
  criticity: z.number().min(1).max(4), // Changed to number with range
});

type ConclusionSchemaType = z.infer<typeof conclusionSchema>;
export default function AnnulerCloture({ task, alerte, onClose }: DeleteProps) {
  const form = useForm<ConclusionSchemaType>({
    resolver: zodResolver(conclusionSchema),
    defaultValues: {
      id: task.id,
      recevableStatus: alerte.recevable || "NON_DECIDE",
      commentaire: task.content || "",
      criticity: alerte.criticite ? Number(alerte.criticite) : 0,
    },
  });
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [controle, setControle] = useState(true);
  const recevableStatus = form.watch("recevableStatus"); // Watch the field

  const onSubmit = async () => {
    try {
      if (session) {
        try {
          const ocp = await AnnulerClo(task.id, session.user.id, task.alertId);
          if (ocp) {
            toast.success("Alert Modified successfully!");
            onClose();
            setIsOpen(false);
            router.refresh();
          }
        } catch (error) {
          console.error("Erreur lors de l'attribution de l'alerte:", error);
        }
      } else {
        toast.error("Erreur lors de l'attribution de l'alerte");
      }
    } catch (error) {
      toast.error("error");
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* This will trigger the Dialog */}
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <FilePenLine className="mr-2 h-4 w-4" />
              Annuler la clôture
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Update Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annulation de la demande de clôture</DialogTitle>
          <DialogDescription>
            Veuillez confirmer l’annulation de la demande de clôture ci-dessous.
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" className="min-w-[120px]">
              Annuler
            </Button>
            <Button  variant={"destructive"} className="min-w-[120px]" onClick={()=>onSubmit()}>
              Oui
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
