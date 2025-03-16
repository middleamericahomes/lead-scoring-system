"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, Users, Tag, DollarSign, BarChart2, Settings, Upload, List
} from 'lucide-react'

/**
 * Navigation items with icons and paths
 * Defines the main sections of the application
 */
const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Deals', href: '/deals', icon: DollarSign },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Import', href: '/leads/import', icon: Upload },
  { name: 'Smart Lists', href: '/smart-lists', icon: List },
  { name: 'Settings', href: '/settings', icon: Settings },
]

/**
 * Navigation sidebar component with links to main app sections
 * Highlights current active route
 */
export function NavSidebar() {
  const pathname = usePathname()
  
  return (
    <div className="h-full w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">Lead Scoring System</h2>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 