import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Lead Scoring System</h1>
      <p className="mb-4">Welcome to the Lead Scoring System dashboard.</p>
      
      <div className="flex gap-4 mb-8">
        <Button variant="primary">View Leads</Button>
        <Button variant="outline">Import Data</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Total Leads</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Qualified Leads</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Average Score</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
} 