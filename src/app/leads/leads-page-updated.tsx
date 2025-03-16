"use client"

import { useState } from 'react'
import { LeadCard } from '@/components/leads/lead-card'
import { LeadFilters } from '@/components/leads/lead-filters'
import { Button } from '@/components/ui/button'
import { Plus, Refresh } from 'lucide-react'

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
] as const;

/**
 * LeadsPage component for displaying and managing leads
 * Features filtering, sorting, and lead actions
 */
export default function LeadsPage() {
  const [leads, setLeads] = useState(sampleLeads)
  const [filteredLeads, setFilteredLeads] = useState(sampleLeads)
  
  const handleViewLead = (lead: typeof sampleLeads[number]) => {
    // In a real app, would navigate to lead detail page
    console.log('Viewing lead:', lead)
  }
  
  const handleEditLead = (lead: typeof sampleLeads[number]) => {
    // In a real app, would open edit modal or navigate to edit page
    console.log('Editing lead:', lead)
  }
  
  const handleDeleteLead = (lead: typeof sampleLeads[number]) => {
    // In a real app, would confirm deletion
    console.log('Deleting lead:', lead)
  }
  
  const handleCreateLead = () => {
    // In a real app, would navigate to create page or open modal
    console.log('Creating new lead')
  }
  
  const handleRecalculateScores = () => {
    // In a real app, would trigger backend calculation
    console.log('Recalculating all lead scores')
    // Would show a progress indicator
  }
  
  const handleApplyFilters = (filters: any) => {
    // Apply filters to the leads data
    const filtered = leads.filter(lead => 
      lead.score >= filters.minScore
    )
    setFilteredLeads(filtered)
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRecalculateScores}>
            <Refresh className="mr-2 h-4 w-4" />
            Recalculate Scores
          </Button>
          <Button onClick={handleCreateLead}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <LeadFilters onApplyFilters={handleApplyFilters} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onView={() => handleViewLead(lead)}
            onEdit={() => handleEditLead(lead)}
            onDelete={() => handleDeleteLead(lead)}
          />
        ))}
      </div>
      
      {/* Show empty state if no leads are available */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">No leads match your filters</p>
          <Button onClick={() => setFilteredLeads(leads)}>Clear Filters</Button>
        </div>
      )}
    </div>
  )
} 