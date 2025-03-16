/**
 * Dashboard Page
 * 
 * The main landing page for the Lead Scoring System.
 * Displays summary statistics and quick access to main features.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FiUsers, FiTag, FiFileText, FiTrendingUp } from 'react-icons/fi';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getLeads } from '@/services/leadService';
import { getTags } from '@/services/tagService';

export default function Dashboard() {
  const router = useRouter();
  
  // Fetch leads and tags for dashboard stats
  const { data: leadsData, isLoading: isLoadingLeads } = useQuery({
    queryKey: ['dashboard-leads'],
    queryFn: () => getLeads({ limit: 5 }),
  });

  const { data: tagsData, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

  // Prepare stat cards data
  const statCards = [
    {
      title: 'Total Leads',
      value: leadsData?.total_count || 0,
      icon: <FiUsers className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50',
      textColor: 'text-blue-700',
      link: '/leads',
    },
    {
      title: 'Active Tags',
      value: tagsData?.length || 0,
      icon: <FiTag className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50',
      textColor: 'text-green-700',
      link: '/tags',
    },
    {
      title: 'Qualified Leads',
      value: leadsData?.items?.filter(lead => lead.status === 'Qualified').length || 0,
      icon: <FiTrendingUp className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50',
      textColor: 'text-purple-700',
      link: '/leads?status=Qualified',
    },
    {
      title: 'Reports',
      value: 'View',
      icon: <FiFileText className="h-6 w-6 text-amber-500" />,
      color: 'bg-amber-50',
      textColor: 'text-amber-700',
      link: '/reports',
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            onClick={() => router.push('/leads/new')}
            icon={<FiUsers />}
          >
            Add New Lead
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow cursor-pointer" 
                 onClick={() => router.push(card.link)}>
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${card.color}`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className={`text-2xl font-semibold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Leads */}
        <Card title="Recent Leads" subtitle="Latest leads added to the system"
              footer={
                <div className="text-right">
                  <Button variant="outline" size="sm" onClick={() => router.push('/leads')}>
                    View All Leads
                  </Button>
                </div>
              }>
          {isLoadingLeads ? (
            <div className="py-4 text-center text-gray-500">Loading recent leads...</div>
          ) : leadsData?.items?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadsData.items.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => router.push(`/leads/${lead.id}`)}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : 
                            lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                            lead.status === 'Lost' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {lead.score !== undefined ? lead.score : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">No leads found</div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
