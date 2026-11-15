'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        'border-b border-[var(--border)] transition-colors duration-200',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 text-left text-base font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors focus-visible:outline-none focus-visible:underline"
      >
        <span className="pr-4">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0',
            isOpen && 'transform rotate-180 text-[var(--accent)]'
          )}
        />
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0 pb-0'
        )}
      >
        <div className="text-sm leading-relaxed text-[var(--text-muted)] pr-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('divide-y divide-[var(--border)] border-y border-[var(--border)]', className)}>
      {children}
    </div>
  );
}

