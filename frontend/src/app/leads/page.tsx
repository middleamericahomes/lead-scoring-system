/**
 * Leads Page
 * 
 * Displays a list of all leads with sorting, filtering, and pagination.
 * Provides access to lead management operations.
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FiSearch, FiPlus, FiFilter, FiDownload, FiUpload } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/tags/TagBadge';
import { getLeads, exportLeadsToCSV } from '@/services/leadService';
import { getTags } from '@/services/tagService';

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Local state for filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get URL parameters
  const statusFilter = searchParams.get('status') || '';
  const tagsFilter = searchParams.get('tags') ? searchParams.get('tags')?.split(',').map(Number) : [];
  
  // Fetch leads with filters
  const { data: leadsData, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads', currentPage, searchTerm, statusFilter, tagsFilter],
    queryFn: () => getLeads({
      page: currentPage,
      limit: 10,
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      tags: tagsFilter?.length ? tagsFilter : undefined,
    }),
  });

  // Fetch tags for filters
  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  // Status options for filter
  const statusOptions = [
    'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'
  ];

  // Handle export action
  const handleExport = async () => {
    try {
      const blob = await exportLeadsToCSV({
        status: statusFilter || undefined,
        tags: tagsFilter?.length ? tagsFilter : undefined,
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              icon={<FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </Button>
            <Button
              variant="outline"
              icon={<FiUpload />}
              onClick={() => router.push('/leads/import')}
            >
              Import
            </Button>
            <Button
              variant="outline"
              icon={<FiDownload />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              icon={<FiPlus />}
              onClick={() => router.push('/leads/new')}
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <Card>
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)}
              />
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                      <button
                        key={status}
                        type="button"
                        className={`px-3 py-1 text-xs font-medium rounded-full
                          ${statusFilter === status 
                            ? 'bg-blue-100 text-blue-800 border-blue-200 border' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        onClick={() => router.push(`/leads?status=${status}`)}
                      >
                        {status}
                      </button>
                    ))}
                    {statusFilter && (
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                        onClick={() => router.push('/leads')}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {!isLoadingTags && tagsData?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tagsData.map(tag => (
                        <TagBadge
                          key={tag.id}
                          tag={tag}
                          showWeight
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Leads table */}
        <Card>
          {isLoadingLeads ? (
            <div className="py-20 text-center text-gray-500">
              <p>Loading leads...</p>
            </div>
          ) : leadsData?.items?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadsData.items.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => router.push(`/leads/${lead.id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.company || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                            lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                            lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                            lead.status === 'Won' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.score !== undefined ? lead.score : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {lead.tags?.map(tag => (
                            <TagBadge key={tag.id} tag={tag} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500">
              <p className="mb-4">No leads found</p>
              <Button 
                onClick={() => router.push('/leads/new')}
                icon={<FiPlus />}
              >
                Add your first lead
              </Button>
            </div>
          )}
          
          {/* Pagination */}
          {leadsData && leadsData.total_count > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, leadsData.total_count)}
                    </span>{' '}
                    of <span className="font-medium">{leadsData.total_count}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
                        ${currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Previous</span>
                      <span className="h-5 w-5">←</span>
                    </button>
                    {Array.from({ length: Math.ceil(leadsData.total_count / 10) }).slice(0, 5).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                          ${currentPage === idx + 1
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage >= Math.ceil(leadsData.total_count / 10)}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
                        ${currentPage >= Math.ceil(leadsData.total_count / 10) ? 'cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      <span className="sr-only">Next</span>
                      <span className="h-5 w-5">→</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
} 