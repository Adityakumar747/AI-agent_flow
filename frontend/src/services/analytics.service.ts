import { apiClient } from '@/lib/api-client';
import { AnalyticsOverview, CallTrend, ConversionMetrics } from '@/types';

class AnalyticsService {
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  }

  async getCallTrends(days: number = 30): Promise<CallTrend[]> {
    const response = await apiClient.get<CallTrend[]>('/analytics/call-trends', {
      params: { days },
    });
    return response.data;
  }

  async getConversionMetrics(): Promise<ConversionMetrics> {
    const response = await apiClient.get<ConversionMetrics>('/analytics/conversion-metrics');
    return response.data;
  }

  async getCampaignPerformance(): Promise<any[]> {
    const response = await apiClient.get('/analytics/campaign-performance');
    return response.data;
  }

  async getAverageDuration(): Promise<any> {
    const response = await apiClient.get('/analytics/average-duration');
    return response.data;
  }

  async getSentimentDistribution(): Promise<any[]> {
    const response = await apiClient.get('/analytics/sentiment-distribution');
    return response.data;
  }

  async getTopCustomers(limit: number = 10): Promise<any[]> {
    const response = await apiClient.get('/analytics/top-customers', {
      params: { limit },
    });
    return response.data;
  }

  async getHourlyDistribution(): Promise<any[]> {
    const response = await apiClient.get('/analytics/hourly-distribution');
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
