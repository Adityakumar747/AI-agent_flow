'use client';

import * as React from 'react';
import { Megaphone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function CampaignPerformance({ data }: any) {
  const campaigns = [
    { name: 'Q4 Outbound Lead Qualification', dialed: 420, conversion: '32.4%', status: 'ACTIVE' },
    { name: 'Post-Demo Appointment Follow-up', dialed: 280, conversion: '48.1%', status: 'ACTIVE' },
    { name: 'Product Feedback & CSAT Survey', dialed: 150, conversion: '18.7%', status: 'COMPLETED' },
  ];

  return (
    <div className="glass rounded-[28px] overflow-hidden">
      <div className="p-6 sm:p-7 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--text)]">Campaign Conversion Breakdown</h2>
          <p className="text-xs text-[var(--text-muted)]">Performance across active dialing queues</p>
        </div>
        <Link
          href="/campaigns"
          className="glass-control text-xs font-mono text-[var(--text)] px-4 py-1.5 rounded-full flex items-center gap-1.5 hover:scale-[1.02] transition-transform"
        >
          <span>All campaigns</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/[0.08] bg-white/[0.02]">
            <tr>
              {['Campaign Name', 'Calls Dialed', 'Spoken Conversion', 'Dialer Status'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3.5 text-[11px] font-mono font-medium text-[var(--text-subtle)] uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {campaigns.map((c) => (
              <tr key={c.name} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-sm text-[var(--text)]">
                  {c.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-[var(--text-muted)]">
                  {c.dialed} calls
                </td>
                <td className="px-6 py-4 font-mono text-xs text-orange-400 font-medium">
                  {c.conversion}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[11px] font-mono text-orange-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
