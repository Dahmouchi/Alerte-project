/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function exportToCSV<T extends object>(rows: T[], filename = "export.csv") {
    if (!rows.length) return
  
    const headers = Object.keys(rows[0]).join(",")
    const csvRows = rows.map(row =>
      Object.values(row).map(value => `"${value}"`).join(",")
    )
    const csvContent = [headers, ...csvRows].join("\n")
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  export function exportToCSV2<T extends object>(
    rows: any[],
    filename: string,
    columns?: string[]
  ) {
    if (!rows.length) return
  
    const selectedColumns = columns || (Object.keys(rows[0]) as (keyof any)[])
    const headers = selectedColumns.join(",")
  
    const csvRows = rows.map(row =>
      selectedColumns.map(key => {
        const value = row[key]
        // Handle commas, quotes, and nulls safely
        const safeValue =
          value === null || value === undefined
            ? ""
            : String(value).replace(/"/g, '""')
        return `"${safeValue}"`
      }).join(",")
    )
  
    const csvContent = [headers, ...csvRows].join("\n")
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  export function exportToCSV3<T extends object>(
    rows: any[],
    filename: string,
    columns?: string[],
    valueMap?: Record<string, { value: any; label: string }[]>
  ) {
    if (!rows || rows.length === 0) {
      console.warn("No data to export")
      return
    }
  
    const header = columns || Object.keys(rows[0])
  
    const csvRows = rows.map((row) => {
      const formattedRow: Record<string, any> = {}
  
      header.forEach((col) => {
        let value = row[col as keyof T]
  
        // Format date for 'createdAt'
        if (col === "createdAt" && value) {
          const date = new Date(value as string)
          value = date.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        }
        // Replace with label if mapping exists
        if (valueMap && valueMap[col as string]) {
          const mapping = valueMap[col as string].find(
            (item) => String(item.value) === String(value)
          )
          value = mapping ? mapping.label : value
        }
  
        // Escape quotes and wrap values in quotes
        const escaped = String(value).replace(/"/g, '""')
        formattedRow[col as string] = `"${escaped}"`
      })
  
      return formattedRow
    })
  
    const csvContent =
      "\uFEFF" +
      [header.join(","), ...csvRows.map((row) => header.map((col) => row[col]).join(","))].join("\n")
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  