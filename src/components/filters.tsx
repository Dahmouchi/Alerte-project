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
  Clock,
  CheckCircle,
  X,
  Check,
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
  {
    value: "ADMIN_RESPONSABLE",
    label: "AD/RE",
    icon: UserCog,
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900",
  },
];

export const status_options = [
  {
    value: "INFORMATIONS_MANQUANTES",
    label: "Informations Supplémentaires",
    icon: HelpCircle,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900",

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
    label: "Clôturée",
    icon: CheckCircle2,
    color: "text-green-500 bg-green-100 dark:bg-green-900",
  },
];
export const criticity_options = [
  {
    value: 0,
    label: "",
    description: "Impact minimal, traitement standard",
    color: "",
    badgeColor: "",
  },
  {
    value: 1,
    label: "Faible",
    description: "Impact minimal, traitement standard",
    icon: Gauge,
    color: "text-green-500 bg-green-100 dark:bg-green-900",
    badgeColor: "bg-green-500",
  },
  {
    value: 2,
    label: "Modérée",
    description: "Impact modéré, nécessite attention",
    icon: AlertCircle,
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900",
    badgeColor: "bg-blue-500",
  },
  {
    value: 3,
    label: "Élevée",
    description: "Impact important, traitement prioritaire",
    icon: AlertTriangle,
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900",
    badgeColor: "bg-orange-500",
  },
  {
    value: 4,
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
    label: "Non Assignée",
    icon: Timer,
    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
  },
  {
    value: "ASSIGNED",
    label: "Assignée",
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

export const analyste_alert_status_options = [
    {
      value: "PENDING",
      label: "En Attente",
      icon: Timer,
      color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900",
    },
    {
      value: "APPROVED",
      label: "Clôturée",
      icon: CheckCircle2,
      color: "text-green-500 bg-green-100 dark:bg-green-900",
    },
    {
      value: "DECLINED",
      label: "Rejetée",
      icon: XCircle,
      color: "text-red-500 bg-red-100 dark:bg-red-900",
    },
    {
      value: "INFORMATIONS_MANQUANTES",
      label: " En cours de traitement",
      icon: HelpCircle,
      color: "text-purple-500 bg-purple-100 dark:bg-purple-900",
    }
  ];

  export const responsable_alert_status_options = [
    {
      value: "PENDING",
      label: "En Attente",
      icon: Clock,
      variant: "warning",
      className: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400",
      badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/80 dark:text-yellow-200",
    },
    {
      value: "APPROVED",
      label: "Validée",
      icon: CheckCircle,
      variant: "success",
      className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200",
    },
    {
      value: "DECLINED",
      label: "Rejetée",
      icon: X,
      variant: "destructive",
      className: "border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400",
      badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200",
    },
    {
      value: "REQUIRES_REVIEW",
      label: "À Réviser",
      icon: AlertCircle,
      variant: "secondary",
      className: "border-blue-200 bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400",
      badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200",
    }
  ];
  export const responsable_alert = [
    {
      value: "APPROVED",
      label: "Validée",
      icon: Check,
      variant: "success",
      className: "border-emerald-200 bg-emerald-600 text-white ",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200",
    },
    {
      value: "PENDING",
      label: "Non Validée",
      icon: X,
      variant: "destructive",
      className: "border-rose-200 bg-red-600 text-white ",
      badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200",
    },
    {
      value: "REQUIRES_REVIEW",
      label: "À Réviser",
      icon: AlertCircle,
      variant: "secondary",
      className: "border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400",
      badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200",
    }
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
