import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('call-trends')
  getCallTrends(@Query('days') days?: string) {
    return this.analyticsService.getCallTrends(days ? parseInt(days) : 30);
  }

  @Get('conversion-metrics')
  getConversionMetrics() {
    return this.analyticsService.getConversionMetrics();
  }

  @Get('campaign-performance')
  getCampaignPerformance() {
    return this.analyticsService.getCampaignPerformance();
  }

  @Get('average-duration')
  getAverageCallDuration() {
    return this.analyticsService.getAverageCallDuration();
  }

  @Get('sentiment-distribution')
  getSentimentDistribution() {
    return this.analyticsService.getSentimentDistribution();
  }

  @Get('top-customers')
  getTopCustomers(@Query('limit') limit?: string) {
    return this.analyticsService.getTopCustomers(limit ? parseInt(limit) : 10);
  }

  @Get('hourly-distribution')
  getHourlyDistribution() {
    return this.analyticsService.getHourlyDistribution();
  }

  @Post('update-daily-metrics')
  updateDailyMetrics(@Query('date') date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    return this.analyticsService.updateDailyMetrics(targetDate);
  }
}
