'use client';

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
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your voice calling overview.
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
