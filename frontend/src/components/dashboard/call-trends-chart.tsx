'use client';

import * as React from 'react';
import { BarChart3 } from 'lucide-react';

export function CallTrendsChart({ data }: any) {
  return (
    <div className="glass rounded-[24px] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--text)]">Call Volume & Trends</h2>
          <p className="text-xs text-[var(--text-muted)]">Rolling 7-day outbound throughput</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="h-64 flex flex-col items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 text-center space-y-2">
        <span className="font-mono text-xs text-orange-400">● LIVE PIPELINE</span>
        <div className="text-sm font-medium text-[var(--text)]">
          {data && data.length ? `${data.length} intervals recorded` : 'Telephony activity ready'}
        </div>
        <p className="text-xs text-[var(--text-muted)] max-w-xs">
          Automatic carrier metrics update in real time as outgoing calls are placed.
        </p>
      </div>
    </div>
  );
}
