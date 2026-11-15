'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface WaveformProps {
  active?: boolean;
  bars?: number;
  height?: number;
  className?: string;
  barColor?: string;
}

export function Waveform({
  active = true,
  bars = 48,
  height = 44,
  className,
  barColor,
}: WaveformProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const barHeights = React.useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < bars; i++) {
      const normalized = i / (bars - 1);
      const envelope = Math.sin(normalized * Math.PI);
      const noise = 0.35 + 0.65 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.8));
      const h = Math.max(0.12, Math.min(1, envelope * noise));
      list.push(h);
    }
    return list;
  }, [bars]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn('flex items-center justify-between gap-[2px] select-none', className)}
      style={{ height: `${height}px` }}
    >
      {barHeights.map((targetHeight, idx) => {
        const duration = 0.8 + ((idx % 7) * 0.12);
        const delay = ((idx * 0.04) % 0.6);
        const shouldAnimate = active && isVisible;

        return (
          <div
            key={idx}
            className="w-[3px] rounded-full transition-all duration-300"
            style={{
              height: `${Math.round(targetHeight * height)}px`,
              backgroundColor: barColor || (active ? 'var(--accent)' : 'var(--border-strong)'),
              opacity: active ? (targetHeight > 0.4 ? 0.95 : 0.65) : 0.3,
              animation: shouldAnimate
                ? `live-pulse ${duration}s ease-in-out ${delay}s infinite alternate`
                : 'none',
              transformOrigin: 'center',
            }}
          />
        );
      })}
    </div>
  );
}

