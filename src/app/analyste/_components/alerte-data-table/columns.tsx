"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { AlertType } from "@/lib/validations/schema";
import {
  analyste_alert_status_options,
  label_options,
  responsable_alert,
} from "@/components/filters";
import { Timer, UserCheck } from "lucide-react";

export const columns: ColumnDef<AlertType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titre" />
    ),
    cell: ({ row }) => {
      const label = label_options.find(
        (label) => label.value === row.original.code
      );

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catégorie" />
    ),
    cell: ({ row }) => {
      const conclusion = row.getValue("category") as string;
      return <div className="w-[80px]">{conclusion}</div>;
    },
  },

  {
    accessorKey: "analysteValidation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Traitement" />
    ),
    cell: ({ row }) => {
      const status = analyste_alert_status_options.find(
        (status) => status.value === row.getValue("analysteValidation")
      );

      if (!status) return null;

      const conclusions = row.original.conlusions || [];

      // Get the latest conclusion
      const latestConclusion = conclusions
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

      const showPing = latestConclusion?.createdBy?.role === "USER";

      return (
        <div
          className={`relative flex w-[150px] items-center px-2 py-1 rounded-full ${status.color}`}
        >
          {status.icon && <status.icon className="mr-2 h-4 w-4" />}
          <span className="font-medium text-xs">{status.label}</span>

          {showPing && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "responsableValidation",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Validation"
        className="flex items-center justify-center"
      />
    ),
    cell: ({ row }) => {
      const status = responsable_alert.find(
        (status) => status.value === row.getValue("responsableValidation")
      );
      const analysteValidation = row.getValue("analysteValidation");

      if (!status) {
        return null;
      }

      if (analysteValidation !== "PENDING") {
        return (
          <div
            className={`flex w-[150px] items-center px-2 py-1 justify-center ${status.className}`}
          >
            <span className="font-medium text-xs">{status.label}</span>
          </div>
        );
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date de création" />
    ),
    cell: ({ row }) => {
      const field = row.getValue("createdAt") as string;
      const date = new Date(field);
      return (
        <div>
          {date.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },

  {
    accessorKey: "assignedAnalystId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("assignedAnalystId");

      if (!status) {
        return (
          <div
            className={`flex w-[150px] items-center px-2 py-1 rounded-full text-yellow-500 bg-yellow-100 dark:bg-yellow-900`}
          >
            <Timer className="mr-2 h-4 w-4" />
            <span className="font-medium text-xs">Non Assignée</span>
          </div>
        );
      } else {
        return (
          <div
            className={`flex w-[150px] items-center px-2 py-1 rounded-full text-blue-500 bg-blue-100 dark:bg-blue-900`}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            <span className="font-medium text-xs">Assignée</span>
          </div>
        );
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
