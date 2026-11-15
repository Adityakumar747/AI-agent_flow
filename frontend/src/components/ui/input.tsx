'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  isMono?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, isMono, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2 text-sm text-[var(--text)] transition-colors placeholder:text-[var(--text-subtle)] focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-1 focus-visible:ring-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50',
          isMono && 'font-mono tracking-wide',
          error && 'border-[var(--danger)] focus-visible:border-[var(--danger)] focus-visible:ring-[var(--danger)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
