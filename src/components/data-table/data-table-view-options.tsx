/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { type Table } from "@tanstack/react-table";
import exportToCsv from "tanstack-table-export-to-csv";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {  Settings2 } from "lucide-react";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const handleExportToCsv = (): void => {
    const headers = table
      .getHeaderGroups()
      .map((x) => x.headers)
      .flat();

    const rows = table.getFilteredRowModel().rows;    
    exportToCsv("persons_data", headers, rows);
  };
  return (
   <div className="flex items-center gap-2">
    <div>
    {/*
    <Button
  type="button"
  variant="outline"
  className="ml-4 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary/90 shadow-sm transition-colors"
  onClick={handleExportToCsv}
>
  <Download className="mr-1 h-3 w-3" />
  <span className="font-semibold text-xs">Exporter les filtres</span>
</Button>
 */}
    </div>
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <Settings2 className='mr-2 h-4 w-4' />
          Voir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[150px]'>
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
   </div>
  );
}
