'use client';

import * as React from 'react';
import { PhoneCall, Users, Megaphone, Calendar, TrendingUp } from 'lucide-react';
import { AnalyticsOverview } from '@/types';

interface DashboardStatsProps {
  data?: AnalyticsOverview;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Calls',
      value: data?.totalCalls?.toLocaleString() || '0',
      icon: PhoneCall,
      description: `${data?.recentCalls || 0} in last 7 days`,
      indicator: '● Carrier line',
    },
    {
      title: 'Active Campaigns',
      value: data?.activeCampaigns?.toLocaleString() || '0',
      icon: Megaphone,
      description: `${data?.totalCampaigns || 0} total campaigns`,
      indicator: '● Running',
    },
    {
      title: 'Total Customers',
      value: data?.totalCustomers?.toLocaleString() || '0',
      icon: Users,
      description: 'Indexed contacts',
      indicator: '● Synced',
    },
    {
      title: 'Appointments',
      value: data?.totalAppointments?.toLocaleString() || '0',
      icon: Calendar,
      description: `${data?.upcomingAppointments || 0} upcoming`,
      indicator: '● Confirmed',
    },
    {
      title: 'Conversion Rate',
      value: `${data?.conversionRate || 0}%`,
      icon: TrendingUp,
      description: 'Spoken bookings',
      indicator: '● AI Goal',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="glass rounded-[24px] p-5 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-subtle)] uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-semibold font-mono tracking-tight text-[var(--text)]">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{stat.description}</div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-orange-400 font-medium">
              {stat.indicator}
            </div>
          </div>
        );
      })}
    </div>
  );
}
