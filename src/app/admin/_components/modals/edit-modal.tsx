"use client";

import { z } from "zod";
import { userStatus, UserType } from "@/lib/validations/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { role_options } from "@/components/filters";

type EditProps = {
  user: UserType;
};

// ** Fixing schema to match UserType
const editSchema = z.object({
    id: z.string().uuid(),
    name: z.string().nullable(),
    prenom: z.string().nullable(),
    email: z.string().nullable(),
    username: z.string(),
    statut: z.boolean().default(false),
    role: z.enum(userStatus).default("USER"),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
  });

type EditSchemaType = z.infer<typeof editSchema>;

export default function EditDialog({ user }: EditProps) {
  const form = useForm<EditSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    },
  });

  function onSubmit(values: EditSchemaType) {
    console.log(values);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit User Details</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Prenom Field */}
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prenom</FormLabel>
                  <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                  <Input type="email" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Select Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {role_options.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <span className="flex items-center">
                              <role.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                              {role.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 w-full">
              Update User
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
