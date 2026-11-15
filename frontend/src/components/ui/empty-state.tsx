'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-[var(--r-lg)] border border-dashed border-[var(--border)] bg-[var(--surface-1)]/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-[var(--r-md)] bg-[var(--surface-2)] flex items-center justify-center mb-3 text-[var(--text-muted)] border border-[var(--border)]">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-[var(--text)] mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-[var(--text-muted)] max-w-sm mb-4">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[var(--r-md)] bg-[var(--surface-2)]',
        className
      )}
      {...props}
    />
  );
}

