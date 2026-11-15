'use client';

import * as React from 'react';
import { PhoneCall, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function RecentCallsList() {
  return (
    <div className="glass rounded-[28px] p-6 sm:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-[var(--text)]">Recent Call Operations</h2>
          <p className="text-xs text-[var(--text-muted)]">Live streaming telemetry, sentiment detection, and durations</p>
        </div>
        <Link
          href="/calls"
          className="glass-control text-xs font-mono text-[var(--text)] px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-[1.02] transition-transform"
        >
          <span>All calls</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mx-auto">
          <PhoneCall className="w-4 h-4 text-orange-400" />
        </div>
        <div className="text-sm font-medium text-[var(--text)]">Connected to Telephony Stream</div>
        <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
          Live call logs, Whisper transcripts, and booking outcomes appear dynamically during active calls.
        </p>
      </div>
    </div>
  );
}
