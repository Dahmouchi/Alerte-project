"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { X } from "lucide-react"
import {analyste_alert_status_options, criticity_options, responsable_alert_status_options, status_options } from "@/components/filters"
import { exportToCSV3 } from "@/lib/exportCSV"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const filteredRows = table.getFilteredRowModel().rows.map(row => row.original)
  const selectedColumns = ["code", "title","category","status","analysteValidation","responsableValidation","criticite","createdAt"]

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Chercher par ID..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
       
         {table.getColumn("analysteValidation") && (
          <DataTableFacetedFilter
            column={table.getColumn("analysteValidation")}
            title="Analyste"
            options={analyste_alert_status_options}
          />
        )} 
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
         <Button
          variant="outline"
          onClick={() => exportToCSV3(filteredRows as object[], "filtered-alertes-data.csv", selectedColumns,
            {
              analysteValidation: analyste_alert_status_options,
              responsableValidation: responsable_alert_status_options,
              status: status_options,
              criticite:criticity_options,
            })}
          className="h-8 px-2 lg:px-3"
        >
          Export CSV
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}