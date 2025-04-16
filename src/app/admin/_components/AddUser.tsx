/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  prenom: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Veuillez entrer un email valide."),
  username: z.string().min(2, "Le nom d'utilisateur doit contenir au moins 2 caractères."),
  role: z.string().nonempty("Veuillez sélectionner un rôle."),
  status: z.boolean().default(true), // Added status field
});

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      prenom: "",
      email: "",
      username: "",
      role: "",
      status: true, // Default to active
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users", {
        ...values,
        status: values.status, // Explicitly include status
      });

      if (response.status === 201) {
        toast.success("Utilisateur ajouté avec succès");
        setIsOpen(false);
        form.reset();
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-green-800 text-white text-[14px] px-4 font-semibold pl-5 h-[2.8em] rounded-md flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#1F7D53] group"
          >
            <span className="mr-10">Ajouter</span>
            <div className="absolute right-[0.3em] bg-white h-[2.2em] w-[2.2em] rounded-sm flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)] shadow-[0.1em_0.1em_0.6em_0.2em_#1F7D53] active:scale-95">
              <Plus className="text-green-700" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouvel utilisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
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
                        <Input type="email" placeholder="Entrez l'email" {...field} />
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

                <div className="grid grid-cols-2 gap-4">
                  {/* Role Dropdown */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un rôle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="ANALYSTE">Analyste</SelectItem>
                            <SelectItem value="RESPONSABLE">Responsable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status Toggle */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Statut du compte</FormLabel>
                        <div className="flex items-center gap-2 pt-2">
                          <Switch
                            id="user-status"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-green-500"
                          />
                          <label htmlFor="user-status" className="text-sm">
                            {field.value ? "Activé" : "Désactivé"}
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "En cours..." : "Ajouter"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddUser;