import { NavSidebar } from '@/components/layout/nav-sidebar'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lead Scoring System',
  description: 'A modern lead scoring and management system',
}

/**
 * Root layout component that wraps all pages
 * Includes the navigation sidebar and main content area
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <NavSidebar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
} 