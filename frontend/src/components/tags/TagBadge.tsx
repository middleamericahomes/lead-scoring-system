/**
 * TagBadge Component
 * 
 * Displays a tag with appropriate styling based on its color.
 * Used for showing lead tags in lists and detail views.
 */

'use client';

import { Tag } from '@/services/leadService';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  showWeight?: boolean;
}

// Ensure the tag color has sufficient contrast for text
const getTextColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate perceived brightness (YIQ formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Return black for light colors, white for dark colors
  return yiq >= 128 ? 'text-gray-800' : 'text-white';
};

export default function TagBadge({ tag, onRemove, showWeight = false }: TagBadgeProps) {
  const textColorClass = getTextColor(tag.color);
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 mb-2`}
      style={{ backgroundColor: tag.color }}
    >
      <span className={textColorClass}>
        {tag.name}
        {showWeight && ` (${tag.weight})`}
      </span>
      
      {onRemove && (
        <button
          type="button"
          className={`${textColorClass} ml-1 hover:opacity-75 focus:outline-none`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
        >
          <span className="sr-only">Remove tag</span>
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
} 