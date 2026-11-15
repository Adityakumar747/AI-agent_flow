'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface MockupWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  statusBadge?: React.ReactNode;
}

export function MockupWindow({
  title = 'call · live',
  tabs,
  activeTab,
  onTabChange,
  statusBadge,
  children,
  className,
  ...props
}: MockupWindowProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--r-xl)] border border-[var(--border)] bg-[var(--surface-1)] shadow-[var(--shadow-lg)] overflow-hidden transition-all duration-300',
        className
      )}
      {...props}
    >
      {/* Top Chrome Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60 backdrop-blur-sm select-none">
        {/* 3 neutral window control dots */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)]" />
        </div>

        {/* Center Title or Tabs */}
        {tabs && tabs.length > 0 ? (
          <div className="flex items-center gap-1 bg-[var(--surface-1)] p-0.5 rounded-[var(--r-md)] border border-[var(--border)]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange?.(tab)}
                className={cn(
                  'px-3 py-1 rounded-[var(--r-sm)] font-mono text-xs transition-colors',
                  activeTab === tab
                    ? 'bg-[var(--surface-3)] text-[var(--text)] font-medium shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <div className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
            {title}
          </div>
        )}

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 min-w-[70px] justify-end">
          {statusBadge}
        </div>
      </div>

      {/* Mockup Body */}
      <div className="relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}

