import LeadsPage from '@/components/leads-page'

/**
 * Main page component that serves as the entry point for the application
 * Renders the LeadsPage component
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <LeadsPage />
    </main>
  )
} 