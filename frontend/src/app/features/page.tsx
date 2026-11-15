'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import {
  Target,
  BarChart3,
  ShieldCheck,
  Phone,
  Calendar,
  Brain,
  ArrowRight,
  Radio,
  Cpu,
  Zap,
} from 'lucide-react';

const DEEP_FEATURES = [
  {
    num: '01',
    title: 'Autonomous Outbound Campaigns',
    description:
      'Launch hundreds of targeted customer calls simultaneously with customized conversational prompts, objection handling, and automated retry cadences.',
    metrics: '1,000+ calls/hour per cluster',
    icon: Target,
  },
  {
    num: '02',
    title: 'Real-time WebSocket Audio Duplex',
    description:
      'Streaming bi-directional audio ensures real-time speech interruptibility. If the customer interjects, playback pauses instantly within 420 milliseconds.',
    metrics: '< 450ms voice turnaround',
    icon: Radio,
  },
  {
    num: '03',
    title: 'Calendar Detection & Instant SMS',
    description:
      'Spoken agreements convert directly into confirmed calendar appointments. The agent verifies date/time slots and immediately dispatches an SMS confirmation.',
    metrics: '82% booking confirmation rate',
    icon: Calendar,
  },
  {
    num: '04',
    title: 'Word-for-Word Whisper Transcripts',
    description:
      'Complete call recordings with precision timestamped transcripts and AI sentiment scoring (Positive, Neutral, Negative) indexed in your PostgreSQL database.',
    metrics: '99.2% transcription accuracy',
    icon: Brain,
  },
  {
    num: '05',
    title: 'Carrier-Grade Twilio Backbone',
    description:
      'Engineered directly on carrier telephony protocols with programmable voice SIP trunking, call recording, and global geographic number pools.',
    metrics: '99.8% carrier deliverability',
    icon: ShieldCheck,
  },
  {
    num: '06',
    title: 'Streaming Telemetry & Analytics',
    description:
      'Live dashboard updates over WebSockets for active call duration, agent performance, sentiment distribution, and conversion funnel reporting.',
    metrics: 'Live WebSocket sync',
    icon: BarChart3,
  },
];

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 selection:bg-white selection:text-black">
      <MarketingNavbar />

      <main className="relative pt-32 sm:pt-40 pb-24">
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 pb-16 max-w-[1280px] mx-auto text-center space-y-5">
          <div className="glass-control inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-[var(--text-muted)] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
            <span>Capabilities & Infrastructure</span>
          </div>

          <h1 className="text-[clamp(36px,6vw,68px)] leading-[1.04] tracking-[-0.035em] text-balance">
            <span className="block font-medium text-[var(--text)]">Core System Features.</span>
            <span className="block font-normal text-[var(--text-muted)]">Engineered for autonomous scale.</span>
          </h1>

          <p className="mx-auto max-w-[34rem] text-base text-[var(--text-muted)] leading-relaxed text-pretty">
            Everything your operations team needs to deploy autonomous voice agents with human-speed cadence and enterprise reliability.
          </p>
        </section>

        {/* ── Feature Cards Grid (Space Glass Craft) ─────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 py-10 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEEP_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.num}
                  className="glass rounded-[28px] p-8 flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs text-[var(--text-subtle)]">{feat.num}</span>
                    </div>

                    <h2 className="text-xl font-medium tracking-tight text-[var(--text)]">
                      {feat.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-subtle)]">METRIC</span>
                    <span className="text-orange-400 font-medium">{feat.metrics}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Call to Action Banner ───────────────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 pt-16 max-w-[1280px] mx-auto">
          <div className="glass-strong rounded-[28px] p-8 sm:p-12 text-center space-y-5 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
              Ready to deploy autonomous voice agents?
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto">
              Launch your first calling campaign in under 5 minutes with our Twilio and OpenAI integration.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/register')}
                className="button-ink w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-full px-7 text-xs font-medium gap-2"
              >
                Create free account
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="glass-control w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-full px-6 text-xs font-medium text-[var(--text)]"
              >
                Sign in to console
              </button>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
