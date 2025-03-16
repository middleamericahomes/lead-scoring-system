"use client"

import * as React from "react"
import { 
  ColumnDef,
  ColumnFiltersState,
  SortingState
} from "@tanstack/react-table"
import { ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table/data-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define Lead data type
interface Lead {
  id: string
  name: string
  email: string
  company: string
  score: number
  status: "new" | "contacted" | "qualified" | "proposal" | "closed"
  industry: string
  createdAt: string
  lastContact: string
}

/**
 * LeadDataTable - Specialized data table for displaying Lead information
 * Features:
 * - Global search filtering
 * - Column visibility toggling
 * - Score-based conditional formatting
 * - Virtualization for large datasets
 * - Built-in pagination
 */
export function LeadDataTable({ data }: { data: Lead[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState({})
  
  // Define columns with sorting, filtering and formatting
  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => <div>{row.getValue("company")}</div>,
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("score"))
        
        // Color formatting based on score
        const getScoreColor = (score: number) => {
          if (score >= 80) return "text-green-600 font-medium"
          if (score >= 60) return "text-emerald-600"
          if (score >= 40) return "text-amber-600"
          if (score >= 20) return "text-orange-600"
          return "text-red-600"
        }
        
        return (
          <div className={getScoreColor(score)}>
            {score}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        
        // Status badge styling
        const getStatusStyles = (status: string) => {
          switch (status) {
            case "new": 
              return "bg-blue-100 text-blue-800 border-blue-300"
            case "contacted": 
              return "bg-purple-100 text-purple-800 border-purple-300"
            case "qualified": 
              return "bg-green-100 text-green-800 border-green-300"
            case "proposal": 
              return "bg-amber-100 text-amber-800 border-amber-300"
            case "closed": 
              return "bg-gray-100 text-gray-800 border-gray-300"
            default:
              return "bg-gray-100 text-gray-800"
          }
        }
        
        return (
          <div className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${getStatusStyles(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )
      },
    },
    {
      accessorKey: "industry",
      header: "Industry",
      cell: ({ row }) => <div>{row.getValue("industry")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        // Format date for better readability
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "lastContact",
      header: "Last Contact",
      cell: ({ row }) => {
        // Format date for better readability
        const date = new Date(row.getValue("lastContact"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
  ]

  // Apply global filter to all searchable columns
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data
    
    return data.filter(item => {
      return Object.values(item).some(value => 
        value.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    })
  }, [data, globalFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-9"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => {
              // Skip columns we always want to show
              if (!column.accessorKey) return null
              
              return (
                <DropdownMenuCheckboxItem
                  key={column.accessorKey as string}
                  className="capitalize"
                  checked={columnVisibility[column.accessorKey as string] !== false}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [column.accessorKey as string]: value,
                    }))
                  }
                >
                  {(column.header as string) || column.accessorKey}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <DataTable 
        columns={columns} 
        data={filteredData}
        // Enable virtualization for datasets larger than 100 rows
        virtualRows={data.length > 100}
      />
      
      <div className="text-sm text-muted-foreground">
        {filteredData.length} leads found.
      </div>
    </div>
  )
} 