'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { Target, BarChart3, ShieldCheck, ArrowRight, Phone, Cpu, Users, Sparkles } from 'lucide-react';

const PRINCIPLES = [
  {
    num: '01',
    title: 'Zero Latency Tolerance',
    description:
      'Human conversations fall apart with 800ms delays. We engineered duplex WebSocket streaming between Twilio carrier audio and Whisper models to maintain sub-420ms responses.',
  },
  {
    num: '02',
    title: 'Natural Human Interruptibility',
    description:
      'Traditional IVRs lock callers into waiting. VoiceForge continuously listens during speech output, cutting audio cleanly the moment a caller speaks.',
  },
  {
    num: '03',
    title: 'Direct Telephony Carrier Backbone',
    description:
      'No browser WebRTC workarounds. VoiceForge connects directly over PSTN carrier lines with Twilio programmable voice, ensuring crystal clear audio and 99.8% completion.',
  },
  {
    num: '04',
    title: 'Verifiable Business Outcomes',
    description:
      'Every conversation ends with a concrete outcome: a verified calendar booking, a qualified lead record, or an actionable sentiment score saved directly to your PostgreSQL database.',
  },
];

const TEAM = [
  {
    name: 'Autonomous Voice Core',
    role: 'Real-time Telephony & GPT-4 Reasoning',
    detail: 'Duplex streaming architecture, carrier SIP trunking, and interruptible speech synthesis.',
  },
  {
    name: 'Conversation Intelligence',
    role: 'Whisper Transcription & Sentiment',
    detail: 'Word-for-word transcript generation, open-ended intent detection, and automated booking validation.',
  },
  {
    name: 'Enterprise Infrastructure',
    role: 'PostgreSQL, WebSockets & Security',
    detail: 'Encrypted call logs, carrier number provisioning, and live telemetry dashboards.',
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 selection:bg-white selection:text-black">
      <MarketingNavbar />

      <main className="relative pt-32 sm:pt-40 pb-24">
        {/* ── Hero Section ────────────────────────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 pb-20 max-w-[1280px] mx-auto text-center space-y-5">
          <div className="glass-control inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-[var(--text-muted)] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span>Mission & Philosophy</span>
          </div>

          <h1 className="text-[clamp(36px,6vw,68px)] leading-[1.04] tracking-[-0.035em] text-balance">
            <span className="block font-medium text-[var(--text)]">Building VoiceForge.</span>
            <span className="block font-normal text-[var(--text-muted)]">Autonomous phone operations at human scale.</span>
          </h1>

          <p className="mx-auto max-w-[34rem] text-base text-[var(--text-muted)] leading-relaxed text-pretty">
            We are building the carrier-grade intelligence layer that lets businesses staff their phone lines with natural, reliable AI agents.
          </p>
        </section>

        {/* ── Mission Card (Space Glass-Strong) ─────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 py-10 max-w-[1280px] mx-auto">
          <div className="glass-strong rounded-[28px] p-8 sm:p-12 space-y-6 max-w-4xl mx-auto">
            <span className="font-mono text-xs text-[var(--text-subtle)]">OUR MISSION</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)] leading-snug">
              Every phone interaction should be immediate, respectful, and genuinely useful.
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              For decades, customers have been trapped in robotic phone menus (&quot;Press 1 for Sales, Press 2 to wait 20 minutes&quot;). Meanwhile, sales and support teams spend thousands of hours manually dialing numbers and hearing voicemail beeps. VoiceForge solves both sides: callers get instant human-cadence help, and companies scale phone operations infinitely.
            </p>
          </div>
        </section>

        {/* ── Principles (Space Numbered Rows) ─────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 py-16 max-w-[1280px] mx-auto border-t border-[var(--border)]">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="font-mono text-xs text-[var(--text-subtle)]">PRINCIPLES</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
              How we approach voice engineering
            </h2>
          </div>

          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {PRINCIPLES.map((p) => (
              <div
                key={p.num}
                className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)] lg:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-x-10 transition-colors"
              >
                <span className="text-[var(--text-subtle)] pt-1 font-mono text-xs sm:text-sm lg:pt-0">
                  {p.num}
                </span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[var(--text)] transition-transform duration-300 ease-out lg:group-hover:translate-x-2">
                  {p.title}
                </h3>
                <p className="col-start-2 mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[var(--text-muted)] transition-colors duration-300 lg:col-start-3 lg:mt-0 lg:group-hover:text-[var(--text)]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture Pillars (Space Glass Cards) ─────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 py-16 max-w-[1280px] mx-auto border-t border-[var(--border)]">
          <div className="max-w-2xl mb-12 space-y-3">
            <span className="font-mono text-xs text-[var(--text-subtle)]">FOUNDATION</span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
              Core Engineering Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="glass rounded-[28px] p-8 space-y-4 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[var(--text)]">{member.name}</h3>
                  <div className="font-mono text-xs text-emerald-400">{member.role}</div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {member.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-10 pt-16 max-w-[1280px] mx-auto">
          <div className="glass-strong rounded-[28px] p-8 sm:p-12 text-center space-y-5 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
              Ready to test VoiceForge?
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
