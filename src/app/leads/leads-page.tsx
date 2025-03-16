"use client"

import { useState } from 'react'
import { LeadCard } from '@/components/leads/lead-card'
import { LeadFilters } from '@/components/leads/lead-filters'
import { Button } from '@/components/ui/button'
import { Plus, RotateCw } from 'lucide-react'

// Sample lead data
const sampleLeads = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    score: 85,
    status: 'qualified',
    source: 'Website',
    createdAt: '2025-03-10T12:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    score: 72,
    status: 'contacted',
    source: 'Referral',
    createdAt: '2025-03-12T09:30:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '(555) 456-7890',
    score: 45,
    status: 'new',
    source: 'Social Media',
    createdAt: '2025-03-15T15:45:00Z',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    phone: '(555) 789-0123',
    score: 93,
    status: 'converted',
    source: 'Email Campaign',
    createdAt: '2025-03-08T10:15:00Z',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    phone: '(555) 321-6547',
    score: 28,
    status: 'lost',
    source: 'Cold Call',
    createdAt: '2025-03-05T14:20:00Z',
  },
]

/**
 * LeadsPage component for displaying a list of leads
 * This is a client component that handles user interactions
 */
export default function LeadsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [filteredLeads, setFilteredLeads] = useState(sampleLeads)

  // Handler functions for lead actions
  const handleViewLead = (id: string) => {
    console.log('Viewing lead:', id)
  }

  const handleEditLead = (id: string) => {
    console.log('Editing lead:', id)
  }

  const handleDeleteLead = (id: string) => {
    console.log('Deleting lead:', id)
  }

  const handleRefresh = () => {
    console.log('Refreshing leads')
    // In a real app, this would fetch the latest leads from the API
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6">
          <LeadFilters
            onApplyFilters={(filters) => {
              console.log('Applying filters:', filters)
              // In a real app, this would filter the leads based on the criteria
            }}
          />
        </div>
      )}

      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onView={handleViewLead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No leads available</p>
          <Button className="mt-4">Add Your First Lead</Button>
        </div>
      )}
    </div>
  )
} 