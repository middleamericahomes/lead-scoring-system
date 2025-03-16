import { apiClient } from '../utils/api';
import { Tag } from './leadService';

/**
 * Tag Service Module
 * 
 * Provides functions for interacting with the tag management API endpoints.
 * Handles CRUD operations for tags used in the lead scoring system.
 */

export interface TagFormData {
  name: string;
  color: string;
  weight: number;
}

// Get all tags
export const getTags = async () => {
  const response = await apiClient.get('/api/tags');
  return response.data;
};

// Get a single tag by ID
export const getTag = async (id: number) => {
  const response = await apiClient.get(`/api/tags/${id}`);
  return response.data;
};

// Create a new tag
export const createTag = async (tagData: TagFormData) => {
  const response = await apiClient.post('/api/tags', tagData);
  return response.data;
};

// Update an existing tag
export const updateTag = async (id: number, tagData: Partial<TagFormData>) => {
  const response = await apiClient.put(`/api/tags/${id}`, tagData);
  return response.data;
};

// Delete a tag
export const deleteTag = async (id: number) => {
  const response = await apiClient.delete(`/api/tags/${id}`);
  return response.data;
}; 