'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { CallTrendsChart } from '@/components/dashboard/call-trends-chart';
import { RecentCallsList } from '@/components/dashboard/recent-calls-list';
import { CampaignOverview } from '@/components/dashboard/campaign-overview';

export default function DashboardPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => analyticsService.getOverview(),
  });

  const { data: callTrends } = useQuery({
    queryKey: ['analytics', 'call-trends'],
    queryFn: () => analyticsService.getCallTrends(7),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-control inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Synchronizing voice operations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Space-Style Section Header */}
      <div className="space-y-1">
        <div className="glass-control inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Telephony Ops · Live Node #01</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
          Operations Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Real-time carrier throughput, sentiment distribution, and appointment conversion metrics.
        </p>
      </div>

      <DashboardStats data={overview} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CallTrendsChart data={callTrends} />
        <CampaignOverview />
      </div>

      <RecentCallsList />
    </div>
  );
}
