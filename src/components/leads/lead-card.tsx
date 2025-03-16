"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Define the Lead interface to type our props
interface Lead {
  id: string
  name: string
  email: string
  phone: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  createdAt: string
}

interface LeadCardProps {
  lead: Lead
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

/**
 * LeadCard component for displaying lead information in a card format
 * 
 * @param lead - The lead data to display
 * @param onView - Optional callback for viewing lead details
 * @param onEdit - Optional callback for editing the lead
 * @param onDelete - Optional callback for deleting the lead
 */
export function LeadCard({ lead, onView, onEdit, onDelete }: LeadCardProps) {
  // Function to determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-blue-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{lead.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{lead.email}</CardDescription>
          </div>
          <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
            {lead.score}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Phone</p>
            <p>{lead.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="capitalize">{lead.status}</p>
          </div>
          <div>
            <p className="text-gray-500">Source</p>
            <p>{lead.source}</p>
          </div>
          <div>
            <p className="text-gray-500">Created</p>
            <p>{formatDate(lead.createdAt)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        {onView && (
          <Button variant="outline" size="sm" onClick={() => onView(lead.id)}>
            View
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(lead.id)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete(lead.id)}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 