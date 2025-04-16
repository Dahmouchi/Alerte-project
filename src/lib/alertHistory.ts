import { Alert, User } from "@prisma/client";

export interface AlertHistoryWithRelations extends AlertHistory {
  alert?: Alert;
  user?: User | null;
}

export interface AlertHistory {
  id: string;
  alertId: string;
  userId: string | null;
  action: string;
  details: string | null;
  createdAt: Date;
}

export type AlertHistoryViewMode = "timeline" | "table" | "changes";