import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bug,
  CheckCircle2,
  HelpCircle,
  PackagePlus,
  ScrollText,
  Timer,
  XCircle,
} from "lucide-react";


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
