import { z } from "zod";

// Define Enums based on your Prisma model
export const alertStatuses = [
  "EN_COURS_TRAITEMENT",
  "INFORMATIONS_MANQUANTES",
  "TRAITE",
  "REJETE",
] as const; // Adjust based on actual statuses


// Define Zod Schema for Alert
export const alertSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  category: z.string().nullable(),
  title: z.string().nullable(),
  conclusion: z.string().nullable(),
  type: z.string().default("text"),
  status: z.enum(alertStatuses).default("EN_COURS_TRAITEMENT"),
  createdAt: z.date().default(new Date()),
  createdById: z.string(),

});

// TypeScript Type for Alert
export type AlertType = z.infer<typeof alertSchema>;
