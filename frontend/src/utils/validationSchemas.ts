import * as Yup from 'yup';

/**
 * Form Validation Schemas
 * 
 * This module provides Yup validation schemas for all forms in the application.
 * These schemas enforce data integrity rules before submitting to the API.
 */

// Lead form validation schema
export const leadValidationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .max(255, 'Email must be at most 255 characters'),
  
  phone: Yup.string()
    .nullable()
    .matches(
      /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      'Invalid phone number format'
    ),
  
  company: Yup.string()
    .nullable()
    .max(100, 'Company name must be at most 100 characters'),
  
  address: Yup.string()
    .nullable()
    .max(255, 'Address must be at most 255 characters'),
  
  status: Yup.string()
    .required('Status is required')
    .oneOf(
      ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
      'Invalid status value'
    ),
  
  tag_ids: Yup.array()
    .of(Yup.number())
    .nullable(),
});

// Tag form validation schema
export const tagValidationSchema = Yup.object({
  name: Yup.string()
    .required('Tag name is required')
    .max(50, 'Tag name must be at most 50 characters'),
  
  color: Yup.string()
    .required('Color is required')
    .matches(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      'Invalid color format (use hex code like #FF0000)'
    ),
  
  weight: Yup.number()
    .required('Weight is required')
    .min(1, 'Weight must be at least 1')
    .max(100, 'Weight must be at most 100')
    .integer('Weight must be a whole number'),
});

// Import CSV validation schema
export const importValidationSchema = Yup.object({
  file: Yup.mixed()
    .required('CSV file is required')
    .test(
      'fileFormat',
      'Unsupported file format. Please upload a CSV file',
      (value) => value && ['text/csv', 'application/vnd.ms-excel'].includes(value.type)
    )
    .test(
      'fileSize',
      'File is too large. Maximum size is 5MB',
      (value) => value && value.size <= 5 * 1024 * 1024 // 5MB
    ),
}); 