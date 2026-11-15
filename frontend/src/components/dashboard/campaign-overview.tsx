'use client';

import * as React from 'react';
import { Megaphone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function CampaignOverview() {
  return (
    <div className="glass rounded-[24px] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--text)]">Active Campaigns</h2>
          <p className="text-xs text-[var(--text-muted)]">Live queue and completion tracking</p>
        </div>
        <Link
          href="/campaigns"
          className="text-xs font-mono text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors"
        >
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="h-64 flex flex-col items-center justify-center rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 text-center space-y-2">
        <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mb-1">
          <Megaphone className="w-4 h-4 text-white" />
        </div>
        <div className="text-sm font-medium text-[var(--text)]">Campaigns Ready for Dialing</div>
        <p className="text-xs text-[var(--text-muted)] max-w-xs">
          Select contacts and prompt configuration to launch outbound calling batches.
        </p>
      </div>
    </div>
  );
}
