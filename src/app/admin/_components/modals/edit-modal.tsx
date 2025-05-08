/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  prenom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Veuillez entrer un email valide."),
  username: z
    .string()
    .min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères."),
  role: z.string().nonempty("Veuillez sélectionner un rôle."),
  statut: z.boolean().default(true), // Added statut field
});

type EditDialogProps = {
  user: any;
  onClose: () => void;
};

const EditDialog = ({ user, onClose }: EditDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      prenom: user.prenom || "",
      email: user.email || "",
      username: user.username,
      role: user.role,
      statut: user.statut, // Default to active
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/users/${user.id}`, values);

      if (response.status === 200) {
        toast.success("Utilisateur ajouté avec succès");
        form.reset();
        onClose();
        router.refresh(); // Refresh the page to show new user

      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de l'ajout de l'utilisateur"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <DialogHeader>
        <DialogTitle>
          Modifier les informations de l&apos;utilisateur
        </DialogTitle>
        <DialogDescription>Remplissez les informations.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom*</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Last Name Field */}
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom*</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Entrez l'email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d&apos;utilisateur*</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(session?.user.role === "ADMIN" || session?.user.role === "ADMIN_RESPONSABLE")  && (
              <div className="grid grid-cols-2 gap-4">
                {/* Role Dropdown */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle*</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMIN_RESPONSABLE">Admin/responsable</SelectItem>
                          <SelectItem value="ANALYSTE">Analyste</SelectItem>
                          <SelectItem value="RESPONSABLE">
                            Responsable
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Statut du compte</FormLabel>
                      <div className="flex items-center gap-2 pt-2">
                        <Switch
                          id="user-statut"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <label htmlFor="user-statut" className="text-sm">
                          {field.value ? "Activé" : "Désactivé"}
                        </label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="submit"
                className=" hover:bg-blue-800/90 cursor-pointer shadow-sm bg-blue-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "En cours..." : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditDialog;
