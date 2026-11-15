'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import { ConversionMetrics } from '@/components/analytics/conversion-metrics';
import { CampaignPerformance } from '@/components/analytics/campaign-performance';
import { SentimentDistribution } from '@/components/analytics/sentiment-distribution';
import { HourlyDistribution } from '@/components/analytics/hourly-distribution';

export default function AnalyticsPage() {
  const { data: conversionMetrics } = useQuery({
    queryKey: ['analytics', 'conversion'],
    queryFn: () => analyticsService.getConversionMetrics(),
  });

  const { data: campaignPerformance } = useQuery({
    queryKey: ['analytics', 'campaigns'],
    queryFn: () => analyticsService.getCampaignPerformance(),
  });

  const { data: sentimentData } = useQuery({
    queryKey: ['analytics', 'sentiment'],
    queryFn: () => analyticsService.getSentimentDistribution(),
  });

  const { data: hourlyData } = useQuery({
    queryKey: ['analytics', 'hourly'],
    queryFn: () => analyticsService.getHourlyDistribution(),
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="glass-control inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Real-time Telephony Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
          Voice Intelligence & Conversion
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Streaming telemetry on caller sentiment, peak pickup hours, and campaign conversion rates.
        </p>
      </div>

      <ConversionMetrics data={conversionMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentDistribution data={sentimentData} />
        <HourlyDistribution data={hourlyData} />
      </div>

      <CampaignPerformance data={campaignPerformance} />
    </div>
  );
}
