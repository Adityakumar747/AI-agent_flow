'use client';

import * as React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

export function SentimentDistribution({ data }: any) {
  const sentiments = [
    { label: 'Positive', percent: 68, color: 'bg-emerald-400', icon: Smile, count: '312 calls' },
    { label: 'Neutral', percent: 24, color: 'bg-neutral-400', icon: Meh, count: '110 calls' },
    { label: 'Negative', percent: 8, color: 'bg-red-400', icon: Frown, count: '36 calls' },
  ];

  return (
    <div className="glass rounded-[28px] p-6 sm:p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--text)]">Sentiment Telemetry</h2>
          <p className="text-xs text-[var(--text-muted)]">Automatic speech tone classification</p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          92% CSAT
        </span>
      </div>

      <div className="space-y-4">
        {sentiments.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-[var(--text)]">
                  <Icon className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                  {s.label}
                </span>
                <span className="font-mono text-[var(--text-subtle)]">
                  {s.percent}% · {s.count}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color}`}
                  style={{ width: `${s.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
