/**
 * Lead CSV Import Page
 * 
 * Allows users to upload and import leads from a CSV file.
 * Handles validation and provides feedback on the import process.
 */

'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { FiUpload, FiAlertCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { importLeadsFromCSV } from '@/services/leadService';
import { importValidationSchema } from '@/utils/validationSchemas';

export default function ImportLeadsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importResult, setImportResult] = useState<{
    total: number;
    imported: number;
    errors: { row: number; message: string }[];
  } | null>(null);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFileName(file.name);
      setFieldValue('file', file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (values: { file: File }, { setSubmitting }: any) => {
    setImportStatus('loading');
    try {
      const result = await importLeadsFromCSV(values.file);
      setImportResult(result);
      setImportStatus('success');
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            icon={<FiArrowLeft />}
            onClick={() => router.push('/leads')}
            className="mr-4"
          >
            Back to Leads
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Import Leads from CSV</h1>
        </div>

        <Card>
          {importStatus === 'success' ? (
            <div className="py-8">
              <div className="flex items-center justify-center mb-6">
                <FiCheckCircle className="h-16 w-16 text-green-500 mb-4" />
              </div>
              <h2 className="text-xl font-semibold text-center mb-4">Import Completed</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-center mb-2">
                  <span className="font-semibold">{importResult?.imported}</span> out of{' '}
                  <span className="font-semibold">{importResult?.total}</span> leads were successfully imported.
                </p>
                {importResult?.errors && importResult.errors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-red-600 mb-2">
                      {importResult.errors.length} error{importResult.errors.length !== 1 ? 's' : ''} occurred:
                    </h3>
                    <ul className="list-disc list-inside text-sm text-red-600">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>
                          Row {error.row}: {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <Button onClick={() => router.push('/leads')}>
                  View Lead List
                </Button>
              </div>
            </div>
          ) : importStatus === 'error' ? (
            <div className="py-8 text-center">
              <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Import Failed</h2>
              <p className="mb-6 text-red-600">There was an error processing your CSV file. Please try again.</p>
              <Button onClick={() => setImportStatus('idle')}>
                Try Again
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">CSV Format Requirements:</h3>
                <ul className="list-disc list-inside text-sm text-blue-700">
                  <li>First row must contain headers (name, email, etc.)</li>
                  <li>Required columns: name, email</li>
                  <li>Optional columns: phone, company, address, status</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <Formik
                  initialValues={{ file: undefined as unknown as File }}
                  validationSchema={importValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, isSubmitting, errors, touched }) => (
                    <Form>
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        {fileName || 'Drag and drop your CSV file here, or click to select'}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        CSV files only, up to 5MB
                      </p>
                      
                      <input
                        id="fileInput"
                        name="file"
                        type="file"
                        accept=".csv,text/csv,application/vnd.ms-excel"
                        onChange={(e) => handleFileChange(e, setFieldValue)}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      
                      <div className="flex flex-col items-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mb-2"
                        >
                          Select CSV File
                        </Button>
                        
                        {touched.file && errors.file && (
                          <p className="text-sm text-red-600 mt-2">{errors.file as string}</p>
                        )}
                        
                        {fileName && (
                          <Button
                            type="submit"
                            isLoading={isSubmitting || importStatus === 'loading'}
                            className="mt-4"
                          >
                            {importStatus === 'loading' ? 'Importing...' : 'Import Leads'}
                          </Button>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Note:</h3>
                <p className="text-sm text-yellow-700">
                  When importing leads, the system will automatically calculate scores based on the lead information 
                  and any tags assigned. Duplicate emails will be skipped to prevent overwriting existing leads.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
} 