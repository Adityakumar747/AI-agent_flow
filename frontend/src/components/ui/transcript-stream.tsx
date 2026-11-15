'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TranscriptLine {
  id?: string | number;
  speaker: 'AGENT' | 'CALLER' | 'SYSTEM';
  text: string;
  time?: string;
}

interface TranscriptStreamProps {
  lines: TranscriptLine[];
  autoPlay?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function TranscriptStream({
  lines,
  autoPlay = false,
  className,
  onComplete,
}: TranscriptStreamProps) {
  const [visibleCount, setVisibleCount] = React.useState(autoPlay ? 1 : lines.length);

  React.useEffect(() => {
    if (!autoPlay) {
      setVisibleCount(lines.length);
      return;
    }

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < lines.length) {
          return prev + 1;
        } else {
          onComplete?.();
          return 1;
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [autoPlay, lines.length, onComplete]);

  return (
    <div className={cn('space-y-3 font-sans text-sm', className)}>
      {lines.slice(0, visibleCount).map((line, idx) => {
        const isAgent = line.speaker === 'AGENT';
        const isSystem = line.speaker === 'SYSTEM';

        if (isSystem) {
          return (
            <div
              key={idx}
              className="py-1 px-3 text-center text-xs text-[var(--text-subtle)] font-mono border-y border-[var(--border)]/40"
            >
              {line.text}
            </div>
          );
        }

        return (
          <div
            key={idx}
            className={cn(
              'flex flex-col gap-1 rounded-[var(--r-md)] p-3 border transition-all duration-300 animate-fade-in',
              isAgent
                ? 'bg-[var(--surface-2)]/80 border-[var(--border)] text-[var(--text)]'
                : 'bg-[var(--surface-1)] border-[var(--border)] text-[var(--text)]'
            )}
          >
            <div className="flex items-center justify-between text-[11px] font-mono select-none">
              <span
                className={cn(
                  'font-semibold tracking-wider uppercase flex items-center gap-1.5',
                  isAgent ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                )}
              >
                {isAgent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                )}
                {line.speaker}
              </span>
              {line.time && (
                <span className="text-[var(--text-subtle)]">{line.time}</span>
              )}
            </div>
            <p className="text-[13.5px] leading-relaxed text-[var(--text)] font-normal">
              {line.text}
            </p>
          </div>
        );
      })}
    </div>
  );
}

