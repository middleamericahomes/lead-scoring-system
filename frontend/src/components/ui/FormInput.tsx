/**
 * FormInput Component
 * 
 * A reusable form input component that integrates with Formik.
 * Supports different input types with consistent styling and error handling.
 */

'use client';

import { InputHTMLAttributes, ReactNode } from 'react';
import { useField } from 'formik';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  helperText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export default function FormInput({
  label,
  name,
  helperText,
  icon,
  fullWidth = true,
  className = '',
  ...rest
}: FormInputProps) {
  // Use Formik's useField hook to connect with form state
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          id={name}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
            ${icon ? 'pl-10' : ''}
            ${hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            ${className}
          `}
          {...field}
          {...rest}
        />
      </div>
      
      {helperText && !hasError && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      
      {hasError && (
        <p className="mt-1 text-xs text-red-600">{meta.error}</p>
      )}
    </div>
  );
} 