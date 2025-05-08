import { z } from "zod";

// Define Enums based on your Prisma model
export const alertStatuses = [
  "EN_COURS_TRAITEMENT",
  "INFORMATIONS_MANQUANTES",
  "TRAITE",
  "REJETE",
] as const; // Adjust based on actual statuses
export const userStatus = [
  "ADMIN",
  "USER",
  "ANALYSTE",
  "RESPONSABLE",
  "ADMIN_RESPONSABLE",
] as const; // Adjust based on actual statuses
export const conclusionSchema = z.object({
  id: z.string(), // instead of z.string().cuid()
  content: z.string(),
  createdAt: z.date(),
  createdBy: z.lazy(() => userSchema), // to avoid circular dependency
});
// Define Zod Schema for Alert
export const alertSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  category: z.string().nullable(),
  title: z.string().nullable(),
  conclusion: z.string().nullable(),
  type: z.string().default("text"),
  conlusions: z.array(conclusionSchema).default([]),
  status: z.enum(alertStatuses).default("EN_COURS_TRAITEMENT"),
  createdAt: z.date().default(new Date()),
  createdById: z.string(),

});



// TypeScript Type for Alert
export type AlertType = z.infer<typeof alertSchema>;

export const userSchema = z.object({
  id: z.string().cuid(), // ✅ Change from .uuid() to .cuid()
  name: z.string().nullable(),
  prenom: z.string().nullable(),
  email: z.string().nullable(),
  username: z.string(),
  statut: z.boolean().default(false),
  role: z.enum(userStatus).default("USER"),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

// TypeScript Type for User
export type UserType = z.infer<typeof userSchema>;
