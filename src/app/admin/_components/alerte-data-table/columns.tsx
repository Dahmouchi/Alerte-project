/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { AlertType } from "@/lib/validations/schema";
import { analyste_alert_status_options, label_options, responsable_alert, status_options } from "@/components/filters"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Statut Alerte" />
    ),
    cell: ({ row }) => {
      const status = status_options.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={`flex w-[180px] items-center px-2 py-1 text-xs rounded-md ${status.color}`}
        >
          {status.icon && <status.icon className="mr-2 h-4 w-4" />}
          <span className="font-medium">{status.label}</span>
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
           <DataTableColumnHeader column={column} title="Traitement" />
         ),
         cell: ({ row }) => {
           const status = analyste_alert_status_options.find(
             (status) => status.value === row.getValue("analysteValidation")
           );
     
           if(!row.getValue("assignedAnalystId"))
            return <div></div>
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
        accessorKey: "assignedAnalystId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Assignation T" />
        ),
        cell: ({ row }) => {
          const criticity = row.getValue("assignedAnalystId");
          
          return (
            <div className="flex items-center w-[100px]">
              <div className={`flex items-center px-3 py-1 rounded-full w-full`}>
                {criticity ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-emerald-700 cursor-pointer text-white rounded-full w-8 h-8 font-semibold flex items-center justify-center text-xs">
                        A
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Assignée</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-red-700 cursor-pointer text-white rounded-full w-8 h-8 font-semibold flex items-center justify-center text-xs">
                        NA
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Non Assignée</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
       {
        accessorKey: "responsableValidation",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Validation" className="flex items-center justify-center" />
        ),
        cell: ({ row }) => {
          const status = responsable_alert.find(
            (status) => status.value === row.getValue("responsableValidation")
          );
          const analysteValidation = row.getValue("analysteValidation");
    
          if(!row.getValue("assignedResponsableId"))
            return <div></div>
          if (!status) {
            return null;
          }
    
        if(analysteValidation !== "PENDING"){
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
          accessorKey: "assignedResponsableId",
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Assignation V" />
          ),
          cell: ({ row }) => {
            const criticity = row.getValue("assignedResponsableId");
            
            return (
              <div className="flex items-center w-[100px]">
                <div className={`flex items-center px-3 py-1 rounded-full w-full`}>
                  {criticity ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-emerald-700 cursor-pointer text-white rounded-full w-8 h-8 font-semibold flex items-center justify-center text-xs">
                          A
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Assignée</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-red-700 cursor-pointer text-white rounded-full w-8 h-8 font-semibold flex items-center justify-center text-xs">
                          NA
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Non Assignée</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          },
          filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
          },
        },
   /* {
      accessorKey: "criticite",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Criticité" />
      ),
      cell: ({ row }) => {
        const criticity = criticity_options.find(
          (option) => option.value === Number(row.getValue("criticite"))
        );
    
        if (!criticity) {
          return <div className="text-gray-400">Non défini</div>;
        }
    
        return (
          <div className="flex items-center">
            <div className={`flex items-center px-3 py-1 rounded-full ${criticity.color}`}>
              <criticity.icon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{criticity.label}</span>
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },*/
   
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
