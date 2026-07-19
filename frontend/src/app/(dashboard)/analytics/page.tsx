'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversionMetrics } from '@/components/analytics/conversion-metrics';
import { CampaignPerformance } from '@/components/analytics/campaign-performance';
import { SentimentDistribution } from '@/components/analytics/sentiment-distribution';
import { HourlyDistribution } from '@/components/analytics/hourly-distribution';
import { useTheme } from '@/components/theme-provider';

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics</h1>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
          Detailed insights and performance metrics
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
