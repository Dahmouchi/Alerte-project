/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { AlertType } from "@/lib/validations/schema";
import { admin_alert_status_options, analyste_alert_status_options, criticity_options, label_options } from "@/components/filters"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const columns: ColumnDef<AlertType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
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
      return (
        <div className="w-[80px]">
          <HoverCard>
            <HoverCardTrigger>
              {conclusion?.length > 20
                ? conclusion.slice(0, 20) + "..."
                : conclusion}
            </HoverCardTrigger>
            <HoverCardContent>
            {conclusion}
            </HoverCardContent>
          </HoverCard>
        </div>
      );
    },
  },
  {
    accessorKey: "adminStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut" />
    ),
    cell: ({ row }) => {
      const status = admin_alert_status_options.find(
        (status) => status.value === row.getValue("adminStatus")
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={`flex w-[150px] items-center px-2 py-1 rounded-full ${status.color}`}
        >
          {status.icon && <status.icon className="mr-2 h-4 w-4" />}
          <span className="font-medium text-xs">{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
       accessorKey: "analysteValidation",
       header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Analyste" />
       ),
       cell: ({ row }) => {
         const status = analyste_alert_status_options.find(
           (status) => status.value === row.getValue("analysteValidation")
         );
   
         if (!status) {
           return null;
         }
   
         return (
           <div
             className={`flex w-[150px] items-center px-2 py-1 rounded-full ${status.color}`}
           >
             {status.icon && <status.icon className="mr-2 h-4 w-4" />}
             <span className="font-medium text-xs">{status.label}</span>
           </div>
         );
       },
       filterFn: (row, id, value) => {
         return value.includes(row.getValue(id));
       },
     },
  {
    accessorKey: "criticite",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criticité" />
    ),
    cell: ({ row }) => {
      const criticity = criticity_options.find(
        (option) => option.value === Number(row.getValue("criticite"))
      );
      const status = row.getValue("analysteValidation");
      
      if (!criticity || status === "PENDING") {
        return <div className="text-gray-400">Non défini</div>;
      }
  
      return (
        <div className="flex items-center w-[100px]">
          <div className={`flex items-center px-3 py-1 rounded-full w-full ${criticity.color}`}>
            {criticity.icon && <criticity.icon className="mr-2 h-4 w-4 flex-shrink-0" />}
            <span className="text-xs font-medium">{criticity.label}</span>
          </div>
        </div>
      );
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
      const field = row.getValue("createdAt") as Date;
      return <div>{field.toDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
