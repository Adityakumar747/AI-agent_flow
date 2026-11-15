'use client';

import * as React from 'react';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          'w-9 h-9 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] opacity-40',
          className
        )}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className={cn(
        'w-9 h-9 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-ring)]',
        className
      )}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}

