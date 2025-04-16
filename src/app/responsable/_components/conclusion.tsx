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
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
type DeleteProps = {
  task: any;
  alerte: any;
};
const conclusionSchema = z.object({
  id: z.string(),
  recevableStatus: z.enum(["RECEVABLE", "NON_RECEVABLE", "NON_RECEVABLE_VALIDER", "NON_DECIDE"]),
  commentaire: z.string().optional(),
  decision: z
    .enum(["APPROVED", "DECLINED", "INFORMATIONS_MANQUANTES"])
    .optional(),
  criticity: z.enum(["1", "2", "3", "4"]),
});

type ConclusionSchemaType = z.infer<typeof conclusionSchema>;
export default function UpdateConclusion({ task, alerte }: DeleteProps) {
  const form = useForm<ConclusionSchemaType>({
    resolver: zodResolver(conclusionSchema),
    defaultValues: {
      id: task.id,
      recevableStatus: alerte.recevable || "NON_DECIDE",
      commentaire: task.content || "",
      criticity: alerte.criticite || "",
    },
  });
  console.log("task", alerte.recevable);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);
  const router = useRouter();

  function onSubmit(values: ConclusionSchemaType) {
    console.log(values);
  }
  return (
    <Dialog>
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
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Dialog */}
      <DeleteConclusion
        task={task}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      />

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
                name="recevableStatus"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Statut de réception
                        </FormLabel>       
                      </div>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 gap-3"
                      >
                        {/* Recevable Option */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="RECEVABLE" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Recevable
                          </FormLabel>
                        </FormItem>
                        {/* Undecided Option */}
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="NON_RECEVABLE" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Non Recevable
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Decision Section - Only shows when RECEVABLE is selected */}
              {form.watch("recevableStatus") === "RECEVABLE" && (
                <FormField
                  control={form.control}
                  name="decision"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Décision finale</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="APPROVED" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Approvée
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="DECLINED" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              Rejetée
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="INFORMATIONS_MANQUANTES" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              Infos manquantes
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
          <Select onValueChange={field.onChange} value={field.value}>
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
