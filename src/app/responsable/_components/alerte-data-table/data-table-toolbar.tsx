"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { X } from "lucide-react"
import { analyste_alert_status_options, criticity_options } from "@/components/filters"
import { DataTableFacetedFilterNumber } from "@/components/data-table/data-table-faceted-filter-number"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Codes..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("analysteValidation") && (
          <DataTableFacetedFilter
            column={table.getColumn("analysteValidation")}
            title="Statut"
            options={analyste_alert_status_options}
          />
        )}
        {table.getColumn("criticite") && (
          <DataTableFacetedFilterNumber
            column={table.getColumn("criticite")}
            title="Criticité"
            options={criticity_options}
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
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}