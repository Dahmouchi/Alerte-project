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
import { useForm } from "react-hook-form";
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
import { updateConclusion } from "@/actions/alertActions";
type DeleteProps = {
  task: any;
  alerte: any;
};
const conclusionSchema = z.object({
  id: z.string(),
  commentaire: z.string(),
    criticity: z.number().min(1).max(4),
  });

type ConclusionSchemaType = z.infer<typeof conclusionSchema>;
export default function UpdateConclusion({ task, alerte }: DeleteProps) {
  const form = useForm<ConclusionSchemaType>({
    resolver: zodResolver(conclusionSchema),
    defaultValues: {
      id: task.id,
      commentaire: task.content || "",
      criticity: alerte.criticite ? Number(alerte.criticite) : 1, 
    },
  });
  const [isOpen, setIsOpen] = useState(false);

  async function onSubmit(values: ConclusionSchemaType) {
      try{
        await updateConclusion(task.id,values.commentaire,values.criticity,alerte.id)
        toast.success("alerte modifiée");
        setIsOpen(false)
        window.location.reload();
      }catch(error){
        toast.error("error")
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
              mettre à jour
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}

      {/* Update Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>La mise à jour de Conclusion</DialogTitle>
          <DialogDescription>
            Modifier les détails de la conclusion ci-dessous
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Recevable Status Selection */}
              

             
   <FormField
      control={form.control}
      name="commentaire"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Commentaire</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Ajoutez vos commentaires ici..."
              className="resize-none min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    {/* Criticity Select */}
    <FormField
      control={form.control}
      name="criticity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Niveau de criticité</FormLabel>
          <Select   onValueChange={(value) => field.onChange(Number(value))}
           value={field.value?.toString()} // Convert to number
          >
            <FormControl>
              <SelectTrigger className="bg-white dark:bg-gray-800">
                <SelectValue placeholder="Sélectionnez un niveau" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="1">Faible</SelectItem>
              <SelectItem value="2">Modérée</SelectItem>
              <SelectItem value="3">Élevée</SelectItem>
              <SelectItem value="4">Critique</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
              {/* Rest of your form fields... */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[120px]"
                >
                  Annuler
                </Button>
                <Button type="submit" className="min-w-[120px]">
                  Enregistrer
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
