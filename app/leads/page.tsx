"use client"

import { LeadDataTable } from "@/components/leads/lead-data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/ui/theme-provider"

/**
 * Generate sample lead data for demonstration
 * In a real application, this would come from an API
 */
function generateSampleLeads(count: number = 200) {
  const industries = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail"]
  const statuses = ["new", "contacted", "qualified", "proposal", "closed"]
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `lead-${i + 1}`,
    name: `Lead ${i + 1}`,
    email: `contact${i + 1}@example${i % 10}.com`,
    company: `Company ${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + (i % 20))}`,
    score: Math.floor(Math.random() * 100),
    status: statuses[i % statuses.length] as "new" | "contacted" | "qualified" | "proposal" | "closed",
    industry: industries[i % industries.length],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    lastContact: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
  }))
}

/**
 * Leads Page Component
 * Displays a data table of leads with search, sorting, and filtering
 */
export default function LeadsPage() {
  const sampleLeads = generateSampleLeads(200)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <div className="flex space-x-2">
            {/* Additional controls can be added here */}
          </div>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Leads</CardTitle>
              <CardDescription>Overall lead count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sampleLeads.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Qualified Leads</CardTitle>
              <CardDescription>Ready for proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {sampleLeads.filter(lead => lead.status === "qualified").length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Average Score</CardTitle>
              <CardDescription>Lead quality metric</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round(sampleLeads.reduce((sum, lead) => sum + lead.score, 0) / sampleLeads.length)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>
              View, search, and manage your sales leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadDataTable data={sampleLeads} />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
} 