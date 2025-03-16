/**
 * AppLayout Component
 * 
 * Provides a consistent layout for all application pages, including:
 * - Navigation sidebar
 * - Header with user controls
 * - Main content area
 */

'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, FiUsers, FiTag, FiFileText,
  FiSettings, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

// Navigation items configuration
const navItems = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Leads', href: '/leads', icon: FiUsers },
  { name: 'Tags', href: '/tags', icon: FiTag },
  { name: 'Reports', href: '/reports', icon: FiFileText },
  { name: 'Settings', href: '/settings', icon: FiSettings },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white z-50 border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Lead Scoring</h1>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-semibold">Lead Scoring</h1>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium group
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-grow">
        <header className="hidden lg:flex h-16 bg-white border-b items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Lead Scoring System</h1>
          <div className="flex items-center space-x-4">
            {/* You can add user profile, notifications, etc. here */}
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-grow p-6 lg:mt-0 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
} 