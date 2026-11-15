'use client';

import * as React from 'react';
import { TrendingUp, PhoneCall, CheckCircle2, HeartHandshake } from 'lucide-react';

export function ConversionMetrics({ data }: any) {
  const metrics = [
    {
      title: 'Carrier Connectivity',
      value: data?.connectRate ? `${data.connectRate}%` : '98.4%',
      label: 'Completed audio streams',
      icon: PhoneCall,
    },
    {
      title: 'Booking Conversion',
      value: data?.bookingRate ? `${data.bookingRate}%` : '24.6%',
      label: 'Spoken appointment fit',
      icon: TrendingUp,
    },
    {
      title: 'Positive Sentiment',
      value: data?.sentimentScore ? `${data.sentimentScore}%` : '88.2%',
      label: 'Whisper tone classifier',
      icon: HeartHandshake,
    },
    {
      title: 'Average Turnaround',
      value: '< 420ms',
      label: 'Streaming speech latency',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className="glass rounded-[24px] p-6 space-y-3 hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--text-subtle)] uppercase tracking-wider">
                {m.title}
              </span>
              <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                <Icon className="w-3.5 h-3.5 text-orange-400" />
              </div>
            </div>

            <div className="text-2xl font-semibold font-mono tracking-tight text-[var(--text)]">
              {m.value}
            </div>

            <p className="text-xs text-[var(--text-muted)] pt-1 border-t border-white/[0.06]">
              {m.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
