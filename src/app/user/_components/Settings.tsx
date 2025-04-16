/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import { User } from "@prisma/client";
import ResetPassword from "@/components/ResetPassword";

// Form schema
const settingsFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  twoFactorEnabled: z.boolean().default(false),
  notificationsEnabled: z.boolean().default(true),
  darkMode: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage(user: any) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      username: user?.user?.name || "",
      email: user?.user?.email || "",
      twoFactorEnabled: user?.user?.twoFactorEnabled,
      notificationsEnabled: true,
      darkMode: false,
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("There was an error updating your settings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6 w-full">
      <div>
        <h1 className="text-2xl font-bold">Paramètres Administrateur</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres et préférences de votre compte
        </p>
      </div>

      <Separator className="my-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="dark:bg-slate-950">
            <CardHeader>
              <CardTitle>Informations du Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d&apos;utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-950">
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Authentification à Deux Facteurs</FormLabel>
                      <FormDescription>
                        Ajoutez une couche de sécurité supplémentaire à votre
                        compte
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="dark:bg-slate-950 w-full">
          <CardHeader>
            <CardTitle>Préférences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <h1 className="font-semibold">Mode Sombre</h1>
                <p>Basculer entre le thème clair et sombre</p>
              </div>
              <DarkModeSwitcher />
            </div>
          </CardContent>
        </Card>
        <ResetPassword id={session?.user.id} />
      </div>
    </div>
  );
}
