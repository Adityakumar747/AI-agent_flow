'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant = 'live' | 'success' | 'warning' | 'danger' | 'neutral';

interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  pulse?: boolean;
}

export function StatusPill({
  className,
  variant = 'neutral',
  pulse = false,
  children,
  ...props
}: StatusPillProps) {
  const variantStyles: Record<StatusVariant, string> = {
    live: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-ring)]',
    success: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-ring)]/40',
    warning: 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/30',
    danger: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/30',
    neutral: 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]',
  };

  const isLive = variant === 'live' || pulse;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[var(--r-full)] border font-mono text-[11px] font-medium tracking-wide uppercase select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {isLive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
        </span>
      )}
      {children}
    </span>
  );
}

export function getStatusVariant(status?: string): StatusVariant {
  if (!status) return 'neutral';
  const s = status.toUpperCase();
  if (['ACTIVE', 'LIVE', 'CALLING', 'IN_PROGRESS', 'RINGING'].includes(s)) return 'live';
  if (['COMPLETED', 'CONFIRMED', 'FINISHED', 'SUCCESS', 'RUNNING'].includes(s)) return 'success';
  if (['PAUSED', 'PENDING', 'QUEUED', 'SCHEDULED'].includes(s)) return 'warning';
  if (['FAILED', 'CANCELLED', 'STOPPED', 'MISSED', 'BUSY'].includes(s)) return 'danger';
  return 'neutral';
}

