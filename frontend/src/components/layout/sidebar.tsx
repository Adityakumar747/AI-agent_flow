'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  Megaphone,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  Phone,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 transition-all duration-300">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">AI Voice Agent</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 AI Voice Agent
        </p>
      </div>
    </div>
  );
}
