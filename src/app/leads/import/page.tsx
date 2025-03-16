"use client"

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpTrayIcon, DocumentTextIcon, ExclamationCircleIcon, CheckCircleIcon } from 'lucide-react';
import { importLeadsFromCsv } from "@/services/lead-service";

/**
 * Lead Import Page Component
 * 
 * Provides functionality to:
 * - Upload CSV files containing lead data
 * - Send files to the backend API for processing
 * - Display import results and potential errors
 * - Show progress state for large imports
 */
export default function ImportLeadsPage() {
  // State to track file selection and upload progress
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles file selection from the input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset previous results when selecting a new file
      setSelectedFile(file);
      setUploadResult(null);
      setError(null);
    }
  };

  /**
   * Handles file upload to the API
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    // Validate file type is CSV
    if (!selectedFile.name.endsWith('.csv')) {
      setError("Only CSV files are supported");
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const result = await importLeadsFromCsv(selectedFile);
      setUploadResult(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset the form to upload another file
   */
  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Import Leads</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Import leads from a CSV file with property information. The system will parse lead data, including multiple phone numbers and email addresses.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                id="file-upload"
              />
              
              {!selectedFile ? (
                <div>
                  <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    Click to select or drag and drop a CSV file
                  </p>
                  <p className="text-xs text-gray-400">
                    Maximum file size: 10MB
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="mt-4"
                  >
                    Select File
                  </Button>
                </div>
              ) : (
                <div>
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                  <p className="mb-2 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Change File
                    </Button>
                    {!uploadResult && (
                      <Button 
                        onClick={handleUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload File"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex items-start">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700 font-medium">Error</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Upload Result Display */}
            {uploadResult && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <p className="text-sm text-green-700 font-medium">
                      Import Complete
                    </p>
                    <p className="text-sm text-green-600">
                      Successfully imported {uploadResult.imported_count} leads.
                      {uploadResult.skipped_count > 0 && ` Skipped ${uploadResult.skipped_count} duplicates.`}
                    </p>
                  </div>
                </div>
                
                {/* Error Details (if any) */}
                {uploadResult.error_count > 0 && (
                  <div className="mt-3 border-t border-green-200 pt-3">
                    <p className="text-sm text-amber-700 font-medium">
                      {uploadResult.error_count} errors occurred:
                    </p>
                    <ul className="mt-1 text-xs text-amber-600 list-disc list-inside">
                      {uploadResult.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                      {uploadResult.has_more_errors && (
                        <li className="font-medium">Additional errors not shown</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 p-4 flex justify-between">
            <div className="text-sm text-gray-500">
              Need help with CSV format? <a href="/templates/leads-import-template.csv" download className="text-blue-600 hover:underline">Download template</a>
            </div>
            
            {uploadResult && (
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="secondary">
                  Import Another File
                </Button>
                <Button asChild>
                  <a href="/leads">View Leads</a>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 