import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";
const CRITICALITY_LEVELS = {
    1: {
      label: "Faible",
      color: "bg-green-100 text-green-800 border border-green-200",
      icon: CheckCircle2, // from lucide-react
    },
    2: {
      label: "Modérée",
      color: "bg-blue-100 text-blue-800 border border-blue-200",
      icon: AlertCircle, // from lucide-react
    },
    3: {
      label: "Élevée",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      icon: AlertTriangle, // from lucide-react
    },
    4: {
      label: "Critique",
      color: "bg-red-100 text-red-800 border border-red-200",
      icon: AlertOctagon, // from lucide-react
    },
  } as const;
export function CriticalityBadge({ level }: { level: 1 | 2 | 3 | 4 }) {
  const status = CRITICALITY_LEVELS[level];
  const explanations = {
    1: "Impact minimal, résolution standard",
    2: "Impact modéré, nécessite attention",
    3: "Impact important, action rapide requise",
    4: "Impact critique, intervention immédiate",
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative inline-flex">
          {level === 4 && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          
          <div
            className={`flex items-center px-3 py-1 rounded-md text-sm cursor-help ${status?.color}`}
          >
            {status?.icon && <status.icon className="mr-2 h-4 w-4" />}
            <span className="font-medium">{status?.label}</span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{explanations[level]}</p>
      </TooltipContent>
    </Tooltip>
  );
}