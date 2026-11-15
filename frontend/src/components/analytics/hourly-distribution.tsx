'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';

export function HourlyDistribution({ data }: any) {
  const hours = [
    { time: '9 AM', height: 40 },
    { time: '10 AM', height: 75 },
    { time: '11 AM', height: 95 },
    { time: '12 PM', height: 60 },
    { time: '1 PM', height: 50 },
    { time: '2 PM', height: 85 },
    { time: '3 PM', height: 100 },
    { time: '4 PM', height: 70 },
    { time: '5 PM', height: 45 },
  ];

  return (
    <div className="glass rounded-[28px] p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--text)]">Hourly Call Distribution</h2>
          <p className="text-xs text-[var(--text-muted)]">Peak answer rate between 11 AM - 3 PM</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
          <Clock className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      <div className="h-40 flex items-end justify-between gap-2 pt-6 px-2">
        {hours.map((h) => (
          <div key={h.time} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <div
              className="w-full rounded-t-lg bg-white/15 group-hover:bg-emerald-400 transition-all duration-200"
              style={{ height: `${h.height}%` }}
            />
            <span className="text-[10px] font-mono text-[var(--text-subtle)] whitespace-nowrap">
              {h.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
