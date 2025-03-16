/**
 * FormSelect Component
 * 
 * A reusable dropdown select component that integrates with Formik.
 * Supports custom options and consistent styling with other form elements.
 */

'use client';

import { SelectHTMLAttributes } from 'react';
import { useField } from 'formik';

interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: Option[];
  helperText?: string;
  fullWidth?: boolean;
}

export default function FormSelect({
  label,
  name,
  options,
  helperText,
  fullWidth = true,
  className = '',
  ...rest
}: FormSelectProps) {
  // Use Formik's useField hook to connect with form state
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <select
        id={name}
        className={`
          block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
          ${hasError 
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${className}
        `}
        {...field}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {helperText && !hasError && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      
      {hasError && (
        <p className="mt-1 text-xs text-red-600">{meta.error}</p>
      )}
    </div>
  );
} 