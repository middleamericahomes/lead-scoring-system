import { apiClient } from '../utils/api';

/**
 * Lead Service Module
 * 
 * Provides functions for interacting with the lead management API endpoints.
 * Handles CRUD operations for leads and lead scoring.
 */

// Lead type definitions
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: string;
  score?: number;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  weight: number;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status: string;
  tag_ids?: number[];
}

// Get all leads with optional filtering
export const getLeads = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  tags?: number[];
}) => {
  const response = await apiClient.get('/api/leads', { params });
  return response.data;
};

// Get a single lead by ID
export const getLead = async (id: number) => {
  const response = await apiClient.get(`/api/leads/${id}`);
  return response.data;
};

// Create a new lead
export const createLead = async (leadData: LeadFormData) => {
  const response = await apiClient.post('/api/leads', leadData);
  return response.data;
};

// Update an existing lead
export const updateLead = async (id: number, leadData: Partial<LeadFormData>) => {
  const response = await apiClient.put(`/api/leads/${id}`, leadData);
  return response.data;
};

// Delete a lead
export const deleteLead = async (id: number) => {
  const response = await apiClient.delete(`/api/leads/${id}`);
  return response.data;
};

// Manually score a lead
export const scoreLead = async (id: number) => {
  const response = await apiClient.post(`/api/leads/${id}/score`);
  return response.data;
};

// Verify lead address
export const verifyLeadAddress = async (id: number) => {
  const response = await apiClient.post(`/api/leads/${id}/verify-address`);
  return response.data;
};

// Batch import leads from CSV
export const importLeadsFromCSV = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/api/leads/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Export leads to CSV
export const exportLeadsToCSV = async (params?: {
  status?: string;
  tags?: number[];
}) => {
  const response = await apiClient.get('/api/leads/export', { 
    params,
    responseType: 'blob' 
  });
  
  return response.data;
}; 