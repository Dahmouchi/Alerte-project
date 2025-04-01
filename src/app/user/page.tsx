"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Header from "./_components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ✅ Zod Schema for Validation
const formSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Must contain at least one number.")
      .regex(/[@$!%*?&]/, "Must contain at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      const response = await axios.post("/api/auth/register", {
        username: values.username,

        password: values.password,

        name: values.username,
      });
      if (response.status === 200) {
        router.push("/user/login");
        toast.success("Utilisateur inscrit avec succès");
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur interne lors de l'inscription");
    }
  }

  return (
    <div
      className="w-full relative h-screen bg-contain dark:bg-slate-950"
      style={{ backgroundImage: 'url("/Element.png")' }}
    >
      <div className="w-full absolute top-0">
        <Header />
      </div>
      <div className="w-full h-full flex justify-center items-center p-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 lg:w-1/3 w-full border shadow-lg p-8 rounded-2xl dark:bg-slate-900 bg-white"
          >
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <div className="mt-1 text-xs text-gray-600">
                    <p
                      className={
                        form.watch("password")?.length >= 8
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      • Minimum 8 caractères
                    </p>
                    <p
                      className={
                        /[A-Z]/.test(form.watch("password") || "")
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      • Une lettre majuscule
                    </p>
                    <p
                      className={
                        /[0-9]/.test(form.watch("password") || "")
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      • Un chiffre
                    </p>
                    <p
                      className={
                        /[@$!%*?&]/.test(form.watch("password") || "")
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      • Un caractère spécial (@$!%*?&)
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmez le mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-full py-3 bg-blue-700 text-white hover:bg-blue-500 cursor-pointer"
            >
              Register
            </Button>
            <div className="mt-4 text-sm text-slate-600 text-center dark:text-slate-300">
              <p>
                Vous avez déjà un compte ?{" "}
                <Link
                  href={"/user/dashboard"}
                  className="text-black hover:underline font-semibold dark:text-slate-200"
                >
                  Connectez-vous ici
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
