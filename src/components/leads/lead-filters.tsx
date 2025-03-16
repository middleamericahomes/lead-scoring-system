"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, X, Save } from 'lucide-react'

/**
 * Interface for lead filter options
 */
interface FilterOptions {
  minScore: number
  tags: string[]
  statuses: string[]
}

/**
 * Lead Filters component for filtering the leads list
 * Can be expanded or collapsed to save space
 * 
 * @param onApplyFilters - Callback function when filters are applied
 */
export function LeadFilters({ 
  onApplyFilters 
}: { 
  onApplyFilters: (filters: FilterOptions) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    minScore: 0,
    tags: [],
    statuses: []
  })
  
  /**
   * Handles applying the selected filters
   */
  const handleApplyFilters = () => {
    onApplyFilters(filters)
    setIsOpen(false)
  }
  
  // Show just the toggle button when filters are collapsed
  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
    )
  }
  
  // Show the expanded filter panel with options
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filter Leads</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Minimum Score</label>
            <input 
              type="number" 
              className="mt-1 w-full rounded-md border border-input px-3 py-2"
              value={filters.minScore}
              onChange={e => setFilters({...filters, minScore: Number(e.target.value)})}
            />
          </div>
          
          {/* Sample tag filter - would be expanded with real tag data */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input type="checkbox" id="tag-foreclosure" className="mr-2" />
                <label htmlFor="tag-foreclosure">Foreclosure</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="tag-probate" className="mr-2" />
                <label htmlFor="tag-probate">Probate</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="tag-bankruptcy" className="mr-2" />
                <label htmlFor="tag-bankruptcy">Bankruptcy</label>
              </div>
            </div>
          </div>
          
          {/* Sample status filter */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input type="checkbox" id="status-new" className="mr-2" />
                <label htmlFor="status-new">New</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="status-contacted" className="mr-2" />
                <label htmlFor="status-contacted">Contacted</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="status-qualified" className="mr-2" />
                <label htmlFor="status-qualified">Qualified</label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Save as Smart List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 