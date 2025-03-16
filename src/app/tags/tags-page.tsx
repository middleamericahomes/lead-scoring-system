"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tag as TagIcon, Plus, Edit, Trash2 } from 'lucide-react'

/**
 * Interface for tag data
 */
interface Tag {
  id: string
  name: string
  category: string
  baseScore: number
  expirationDays: number
  isExpired: boolean
}

// Sample tag data - would come from API in production
const sampleTags: Tag[] = [
  { id: '1', name: 'Foreclosure', category: 'Property', baseScore: 1500, expirationDays: 90, isExpired: false },
  { id: '2', name: 'Probate', category: 'Property', baseScore: 1200, expirationDays: 120, isExpired: false },
  { id: '3', name: 'Bankruptcy', category: 'Owner Stress', baseScore: 1000, expirationDays: 60, isExpired: false },
  { id: '4', name: 'Verified Contact', category: 'Contact', baseScore: 500, expirationDays: 0, isExpired: false },
  { id: '5', name: 'Expired - Code Violation', category: 'Property', baseScore: 800, expirationDays: 30, isExpired: true },
]

// Tag categories for grouping
const tagCategories = ['Property', 'Owner Stress', 'Contact', 'Deal Status']

/**
 * Tag management page for creating, editing and organizing tags
 * Groups tags by category and shows relevant metadata
 */
export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(sampleTags)
  
  // This would be expanded with real functionality
  const handleCreateTag = () => {
    console.log('Create tag modal would open')
  }
  
  const handleEditTag = (tagId: string) => {
    console.log('Edit tag modal would open for tag:', tagId)
  }
  
  const handleDeleteTag = (tagId: string) => {
    console.log('Delete tag confirmation would show for tag:', tagId)
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tag Management</h1>
        <Button onClick={handleCreateTag}>
          <Plus className="mr-2 h-4 w-4" />
          Create Tag
        </Button>
      </div>
      
      {tagCategories.map(category => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category} Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags
              .filter(tag => tag.category === category)
              .map(tag => (
                <Card key={tag.id} className={tag.isExpired ? "border-red-300" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center">
                        <TagIcon className="mr-2 h-5 w-5" />
                        <span>{tag.name}</span>
                      </div>
                      <span className="text-lg">{tag.baseScore} pts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm mb-3">
                      {tag.expirationDays > 0 ? (
                        <span>Expires after {tag.expirationDays} days</span>
                      ) : (
                        <span>Never expires</span>
                      )}
                      {tag.isExpired && (
                        <span className="text-red-500 ml-2 font-medium">EXPIRED</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTag(tag.id)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTag(tag.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {/* Show placeholder if no tags in this category */}
            {tags.filter(tag => tag.category === category).length === 0 && (
              <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 border-gray-300">
                <p className="text-muted-foreground mb-4">No {category} tags yet</p>
                <Button variant="outline" size="sm" onClick={handleCreateTag}>
                  <Plus className="h-4 w-4 mr-1" /> Add Tag
                </Button>
              </Card>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 