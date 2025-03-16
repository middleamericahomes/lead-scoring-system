import axios from 'axios';

/**
 * API client configuration
 * 
 * This module configures and exports an Axios instance for making HTTP requests
 * to our backend API. It sets the base URL and default headers for all requests.
 * 
 * Usage:
 * import { apiClient } from 'utils/api';
 * const response = await apiClient.get('/leads');
 */

// Create base axios instance with common configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptors for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptors for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
); 