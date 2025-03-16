"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, File, Check, X, AlertTriangle } from 'lucide-react'

/**
 * Enum representing the current step in the import process
 */
enum ImportStep {
  Upload,
  Map,
  Preview,
  Import
}

/**
 * Lead Import Page Component
 * Provides a multi-step wizard for importing leads from CSV files
 */
export default function LeadImportPage() {
  const [currentStep, setCurrentStep] = useState<ImportStep>(ImportStep.Upload)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  /**
   * Handles the file selection event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if it's a CSV file
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setUploadError('Please select a valid CSV file')
        return
      }
      
      setFile(selectedFile)
      setUploadError(null)
    }
  }
  
  /**
   * Handles the file upload process
   */
  const handleUpload = () => {
    if (!file) {
      setUploadError('Please select a file first')
      return
    }
    
    setIsUploading(true)
    
    // Simulate file processing - would be an API call in production
    setTimeout(() => {
      setIsUploading(false)
      setCurrentStep(ImportStep.Map)
    }, 1500)
  }
  
  /**
   * Renders the file upload step
   */
  const renderUploadStep = () => (
    <div className="flex flex-col items-center">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 w-full max-w-lg 
                  flex flex-col items-center justify-center cursor-pointer hover:border-primary"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-10 w-10 text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-1">Drop your CSV file here or click to browse</p>
        <p className="text-sm text-gray-500 mb-4">Supports CSV files up to 10MB</p>
        
        <input 
          id="file-upload"
          type="file" 
          accept=".csv" 
          className="hidden"
          onChange={handleFileChange}
        />
        
        {file && (
          <div className="flex items-center mt-4 bg-background p-3 rounded-md border w-full">
            <File className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium truncate">{file.name}</span>
            <span className="text-xs text-gray-500 ml-2">
              ({Math.round(file.size / 1024)} KB)
            </span>
          </div>
        )}
        
        {uploadError && (
          <div className="flex items-center mt-4 text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>
      
      <Button 
        className="mt-6" 
        onClick={handleUpload} 
        disabled={!file || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload and Continue'}
      </Button>
    </div>
  )
  
  /**
   * Renders the column mapping step
   */
  const renderMapStep = () => (
    <div>
      <p className="text-center text-muted-foreground mb-6">
        Map the columns from your CSV file to the lead fields in our system
      </p>
      
      <div className="border rounded-md p-4 mb-6">
        <h3 className="font-medium mb-3">Column Mapping</h3>
        
        {/* These would be dynamically generated based on the CSV headers */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">CSV Column</label>
              <div className="bg-accent p-2 rounded mt-1">Name</div>
            </div>
            <div>
              <label className="text-sm font-medium">Maps to Field</label>
              <select className="w-full p-2 border rounded mt-1">
                <option value="name">Lead Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">CSV Column</label>
              <div className="bg-accent p-2 rounded mt-1">Email</div>
            </div>
            <div>
              <label className="text-sm font-medium">Maps to Field</label>
              <select className="w-full p-2 border rounded mt-1">
                <option value="email">Email</option>
                <option value="name">Lead Name</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">CSV Column</label>
              <div className="bg-accent p-2 rounded mt-1">Phone</div>
            </div>
            <div>
              <label className="text-sm font-medium">Maps to Field</label>
              <select className="w-full p-2 border rounded mt-1">
                <option value="phone">Phone</option>
                <option value="name">Lead Name</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(ImportStep.Upload)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(ImportStep.Preview)}>
          Continue to Preview
        </Button>
      </div>
    </div>
  )
  
  /**
   * Renders the preview step
   */
  const renderPreviewStep = () => (
    <div>
      <p className="text-center text-muted-foreground mb-6">
        Preview of the first 5 rows from your CSV file
      </p>
      
      <div className="border rounded-md p-4 mb-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample preview data - would be real in production */}
            <tr className="border-b">
              <td className="p-2">John Smith</td>
              <td className="p-2">john@example.com</td>
              <td className="p-2">(555) 123-4567</td>
              <td className="p-2">
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" /> Valid
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Jane Doe</td>
              <td className="p-2">jane@example.com</td>
              <td className="p-2">(555) 987-6543</td>
              <td className="p-2">
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" /> Valid
                </span>
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Mike Johnson</td>
              <td className="p-2">mike@</td>
              <td className="p-2">(555) 555-5555</td>
              <td className="p-2">
                <span className="flex items-center text-red-600">
                  <X className="h-4 w-4 mr-1" /> Invalid Email
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="border rounded-md p-4 mb-6">
        <h3 className="font-medium mb-2">Import Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <input type="checkbox" id="skip-invalid" className="mt-1 mr-2" />
            <label htmlFor="skip-invalid">
              <div className="font-medium">Skip invalid records</div>
              <div className="text-sm text-muted-foreground">Records with validation errors will be skipped</div>
            </label>
          </div>
          
          <div className="flex items-start">
            <input type="checkbox" id="no-mail" className="mt-1 mr-2" />
            <label htmlFor="no-mail">
              <div className="font-medium">Do Not Append Mailing Address (DNAMA)</div>
              <div className="text-sm text-muted-foreground">Prevent system from auto-appending mailing addresses</div>
            </label>
          </div>
          
          <div className="flex items-start">
            <input type="checkbox" id="auto-tags" className="mt-1 mr-2" checked />
            <label htmlFor="auto-tags">
              <div className="font-medium">Apply automatic tagging rules</div>
              <div className="text-sm text-muted-foreground">Automatically add relevant tags based on lead data</div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(ImportStep.Map)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(ImportStep.Import)}>
          Start Import
        </Button>
      </div>
    </div>
  )
  
  /**
   * Renders the import progress step
   */
  const renderImportStep = () => (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6">
        <div className="inline-block p-6 bg-green-100 rounded-full">
          <Check className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Import Complete!</h2>
      <p className="text-muted-foreground mb-6">
        3 leads were successfully imported into your database.
      </p>
      
      <div className="flex flex-col items-center p-6 border rounded-md bg-background mb-6">
        <div className="text-4xl font-bold mb-2">3</div>
        <div className="text-sm text-muted-foreground">Total Records</div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
      </div>
      
      <div className="space-x-4">
        <Button variant="outline" onClick={() => setCurrentStep(ImportStep.Upload)}>
          Import Another File
        </Button>
        <Button asChild>
          <a href="/leads">View Leads</a>
        </Button>
      </div>
    </div>
  )
  
  /**
   * Returns the appropriate step content based on the current import step
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case ImportStep.Upload:
        return renderUploadStep()
      case ImportStep.Map:
        return renderMapStep()
      case ImportStep.Preview:
        return renderPreviewStep()
      case ImportStep.Import:
        return renderImportStep()
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Import Leads</h1>
        
        {/* Progress steps */}
        <div className="flex mb-8">
          {[
            { step: ImportStep.Upload, label: 'Upload CSV' },
            { step: ImportStep.Map, label: 'Map Columns' },
            { step: ImportStep.Preview, label: 'Preview Data' },
            { step: ImportStep.Import, label: 'Import' },
          ].map((stepInfo, index) => (
            <div key={index} className="flex-1">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= stepInfo.step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > stepInfo.step ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{stepInfo.step + 1}</span>
                  )}
                </div>
                
                <div className={`h-1 flex-1 ${
                  index < 3 ? (currentStep > stepInfo.step ? 'bg-primary' : 'bg-gray-200') : 'hidden'
                }`} />
              </div>
              <div className="mt-2 text-sm">
                {stepInfo.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {[
              'Upload Your CSV File',
              'Map CSV Columns',
              'Preview Import',
              'Import Complete',
            ][currentStep]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  )
} 