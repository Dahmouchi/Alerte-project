import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle2,
  HelpCircle,
  PackagePlus,
  ScrollText,
  Timer,
  UserCheck,
  XCircle,
  Gauge, AlertCircle, Siren,
} from "lucide-react";

import { User, ShieldCheck, Briefcase, UserCog } from "lucide-react";

export const role_options = [
  {
    value: "USER",
    label: "User",
    icon: User,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900",
  },
  {
    value: "ADMIN",
    label: "Admin",
    icon: ShieldCheck,
    color: "text-green-500 bg-green-100 dark:bg-green-900",
  },
  {
    value: "ANALYSTE",
    label: "Analyst",
    icon: Briefcase,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900",
  },
  {
    value: "RESPONSABLE",
    label: "Manager",
    icon: UserCog,
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900",
  },
];

export const status_options = [
  {
    value: "INFORMATIONS_MANQUANTES",
    label: "Information Manquantes",
    icon: HelpCircle,
    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
  },
  {
    value: "EN_COURS_TRAITEMENT",
    label: "En Cours de Traitement",
    icon: Timer,
    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
  },
  {
    value: "REJETE",
    label: "Rejeté",
    icon: XCircle,
    color: "text-red-500 bg-red-100 dark:bg-red-900",
  },
  {
    value: "TRAITE",
    label: "Traité",
    icon: CheckCircle2,
    color: "text-green-500 bg-green-100 dark:bg-green-900",
  },
];
export const criticity_options = [
  {
    value: "1",
    label: "Faible",
    description: "Impact minimal, traitement standard",
    icon: Gauge,
    color: "text-green-500 bg-green-100 dark:bg-green-900",
    badgeColor: "bg-green-500",
  },
  {
    value: "2",
    label: "Modérée",
    description: "Impact modéré, nécessite attention",
    icon: AlertCircle,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    badgeColor: "bg-blue-500",
  },
  {
    value: "3",
    label: "Élevée",
    description: "Impact important, traitement prioritaire",
    icon: AlertTriangle,
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900",
    badgeColor: "bg-orange-500",
  },
  {
    value: "4",
    label: "Critique",
    description: "Impact critique, traitement immédiat",
    icon: Siren,
    color: "text-red-500 bg-red-100 dark:bg-red-900",
    badgeColor: "bg-red-500",
  },
];
export const admin_alert_status_options = [
  {
    value: "PENDING",
    label: "En Attente",
    icon: Timer,
    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
  },
  {
    value: "ASSIGNED",
    label: "Assigné",
    icon: UserCheck,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900",
  },
  {
    value: "APPROVED",
    label: "Approuvé",
    icon: CheckCircle2,
    color: "text-green-500 bg-green-100 dark:bg-green-900",
  },
  {
    value: "DECLINED",
    label: "Refusé",
    icon: XCircle,
    color: "text-red-500 bg-red-100 dark:bg-red-900",
  },
  {
    value: "ESCALATED",
    label: "Escaladé",
    icon: AlertTriangle,
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900",
  },
];



export const label_options = [
  {
    value: "bug",
    label: "Bug",
    icon: Bug,
  },
  {
    value: "feature",
    label: "Feature",
    icon: PackagePlus,
  },
  {
    value: "documentation",
    label: "Documentation",
    icon: ScrollText,
  },
];

export const priority_options = [
  {
    value: "low",
    label: "Low",
    icon: ArrowDown,
  },
  {
    value: "medium",
    label: "Medium",
    icon: ArrowRight,
  },
  {
    value: "high",
    label: "High",
    icon: ArrowUp,
  },
];
