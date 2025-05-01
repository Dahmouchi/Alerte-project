
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
  
  