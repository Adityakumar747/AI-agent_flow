'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-[var(--accent-ring)] focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98]',
        primary:
          'bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98]',
        accent:
          'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold hover:bg-[var(--accent-hover)] active:scale-[0.98] shadow-[0_0_24px_rgba(52,211,153,0.35)]',
        secondary:
          'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-3)] hover:border-[var(--border-strong)] active:scale-[0.98]',
        outline:
          'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)]',
        ghost:
          'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
        destructive:
          'bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)] hover:text-white',
        danger:
          'bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)] hover:text-white',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 text-sm rounded-[var(--r-md)] gap-2',
        sm: 'h-8 px-3 text-xs rounded-[var(--r-sm)] gap-1.5',
        md: 'h-10 px-4 text-sm rounded-[var(--r-md)] gap-2',
        lg: 'h-12 px-6 text-base rounded-[var(--r-md)] gap-2.5',
        icon: 'h-10 w-10 p-0 rounded-[var(--r-md)] justify-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current mr-1.5" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
