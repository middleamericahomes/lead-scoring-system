/**
 * Imports leads from a CSV file
 * @param file - The CSV file to import
 * @returns Result of the import operation with counts and errors
 */
export async function importLeadsFromCsv(file: File): Promise<{
  filename: string;
  imported_count: number;
  skipped_count: number;
  error_count: number;
  errors: string[];
  has_more_errors: boolean;
}> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/v1/imports/leads', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to import leads');
  }

  return response.json();
} 