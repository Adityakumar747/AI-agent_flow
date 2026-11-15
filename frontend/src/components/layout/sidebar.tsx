'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PhoneCall,
  Users,
  Megaphone,
  Calendar,
  BarChart3,
  Phone,
  Sparkles,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Calls', href: '/calls', icon: PhoneCall },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <aside className="flex flex-col w-64 border-r border-[var(--border)] bg-[var(--surface-1)] transition-all duration-300 select-none">
      {/* Brand Header */}
      <div className="flex items-center h-16 px-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors group-hover:bg-white/20">
            <Phone className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm tracking-tight text-[var(--text)]">
              VoiceForge
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl transition-all duration-150',
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm dark:bg-white dark:text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.04]'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Telephony Status & Footer */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        <div className="glass-control p-2.5 rounded-xl flex items-center justify-between text-[11px] font-mono">
          <span className="text-[var(--text-subtle)]">TELEPHONY</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            TWILIO ACTIVE
          </span>
        </div>
        <p className="text-[10px] text-center text-[var(--text-subtle)] font-mono">
          VOICEFORGE · ENGINE v2.0
        </p>
      </div>
    </aside>
  );
}
