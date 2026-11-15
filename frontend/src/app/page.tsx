'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { MockupWindow } from '@/components/ui/mockup-window';
import { Waveform } from '@/components/ui/waveform';
import { TranscriptStream, TranscriptLine } from '@/components/ui/transcript-stream';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import {
  Phone,
  Mic,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock,
  MessageSquare,
  Layers,
  Check,
} from 'lucide-react';

// ── Sample Live Demo Transcript ──────────────────────────────────────────────
const HERO_TRANSCRIPT: TranscriptLine[] = [
  {
    speaker: 'AGENT',
    text: 'Good afternoon Marcus! This is Sarah from VoiceForge. I am following up on your request to evaluate our automated phone outreach platform. Do you have two minutes?',
    time: '0:02',
  },
  {
    speaker: 'CALLER',
    text: 'Hi Sarah. Yes, I do. Does your system support instant appointment booking directly into our calendar?',
    time: '0:08',
  },
  {
    speaker: 'AGENT',
    text: 'Yes, absolutely. During the call, I check your real-time availability, confirm the chosen slot with the customer, and send an SMS confirmation immediately. Would tomorrow at 3 PM work for a live test?',
    time: '0:14',
  },
  {
    speaker: 'CALLER',
    text: 'Tomorrow at 3 PM is great. Lock that in.',
    time: '0:20',
  },
  {
    speaker: 'AGENT',
    text: 'Confirmed! You are scheduled for tomorrow at 3:00 PM EST. I have just triggered your confirmation SMS.',
    time: '0:24',
  },
];

// ── Space-Style Features 01–05 Data ─────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    title: 'Real-time conversational intelligence',
    description:
      'Human-speed dialogue powered by OpenAI GPT-4 and Whisper speech recognition. Responds within milliseconds without robotic lag.',
    mockupTitle: 'engine · whisper-gpt4',
    badge: 'SUB-SECOND LATENCY',
    content: {
      type: 'engine',
      metrics: [
        { label: 'Voice Turnaround', value: '420ms' },
        { label: 'Word Accuracy', value: '99.4%' },
        { label: 'Interruptibility', value: 'Active' },
      ],
      codeSnippet: `// Live Voice Stream Event Loop
agent.on("caller_speech_interrupted", (event) => {
  audioPipeline.flushBuffer();
  gpt4Stream.cancelCurrentCompletion();
  ttsEngine.speakImmediate(event.adaptiveResponse);
});`,
    },
  },
  {
    num: '02',
    title: 'Autonomous outbound campaigns',
    description:
      'Schedule and launch bulk calling campaigns to targeted customer lists. Automate follow-ups, re-engagement, and customer outreach at scale.',
    mockupTitle: 'campaigns · batch-runner',
    badge: 'AUTONOMOUS QUEUE',
    content: {
      type: 'campaigns',
      name: 'Q4 Product Demo Outreach',
      progress: 78,
      completedCalls: 342,
      totalCalls: 450,
      activeLines: 12,
    },
  },
  {
    num: '03',
    title: 'Automated appointment booking',
    description:
      'Convert spoken phone agreements directly into scheduled calendar appointments with automated SMS confirmations via Twilio.',
    mockupTitle: 'appointments · calendar-sync',
    badge: 'SMS CONFIRMED',
    content: {
      type: 'appointment',
      date: 'Thursday, 3:00 PM EST',
      customer: 'Marcus Vance (+1 415-890-2341)',
      status: 'CONFIRMED',
      smsStatus: 'Delivered (Twilio)',
    },
  },
  {
    num: '04',
    title: 'Full call transcripts & sentiment analysis',
    description:
      'Every conversation is recorded and transcribed in real time. Automatic sentiment classification flags positive, neutral, or negative caller responses.',
    mockupTitle: 'transcripts · sentiment',
    badge: '92% POSITIVE',
    content: {
      type: 'sentiment',
      score: 'Positive (0.94)',
      summary: 'Customer expressed high purchase intent for automated appointment booking.',
      keywords: ['Instant booking', 'Calendar sync', 'Twilio integration'],
    },
  },
  {
    num: '05',
    title: 'Telephony & WebSocket streaming',
    description:
      'Built on carrier-grade Twilio voice infrastructure with live WebSocket event streaming so you can monitor call status and outcomes instantly.',
    mockupTitle: 'telephony · webhooks',
    badge: 'CARRIER READY',
    content: {
      type: 'telephony',
      protocol: 'Twilio Media Streams / WebSockets',
      status: '200 OK — Ready for Production',
      endpoints: ['POST /calls/twiml', 'WSS /calls/stream', 'POST /campaigns/webhook'],
    },
  },
];

// ── Use Cases Data ────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    category: 'LEAD GENERATION',
    title: 'Qualify inbound & outbound leads instantly.',
    description:
      'Engage leads seconds after they submit a form. Qualify intent, answer common inquiries, and route high-value prospects immediately.',
    icon: Zap,
  },
  {
    category: 'SCHEDULING',
    title: 'Fill sales calendars without back-and-forth emails.',
    description:
      'Call prospective clients, determine scheduling fit, and secure booked appointments directly into your team calendar.',
    icon: Calendar,
  },
  {
    category: 'CUSTOMER CARE',
    title: 'Automated appointment reminders & confirmations.',
    description:
      'Cut no-show rates by placing courteous automated reminder calls that allow clients to confirm, reschedule, or cancel with their voice.',
    icon: Clock,
  },
  {
    category: 'FEEDBACK & CSAT',
    title: 'Collect authentic customer feedback at scale.',
    description:
      'Conduct friendly post-service feedback calls with natural open-ended conversations and automatic sentiment detection.',
    icon: MessageSquare,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);
  const [isAnnualPricing, setIsAnnualPricing] = React.useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 selection:bg-[var(--accent)] selection:text-[var(--accent-ink)]">
      {/* ── 6.1 Navbar ──────────────────────────────────────────────────────── */}
      <MarketingNavbar />

      <main className="relative">
        {/* ── 6.2 Hero Section ───────────────────────────────────────────────── */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          {/* Subtle Glow and Grid Texture */}
          <div className="absolute inset-0 bg-grid-pattern opacity-70 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] hero-glow pointer-events-none" />

          <div className="relative max-w-[1200px] mx-auto px-6">
            {/* Hero Copy */}
            <div className="max-w-3xl mx-auto text-center space-y-6">
              {/* Eyebrow Live Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-full)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono select-none">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-live-pulse" />
                <span className="text-[var(--accent)] font-semibold">● Live</span>
                <span className="text-[var(--border)]">|</span>
                <span className="text-[var(--text-muted)]">
                  Autonomous AI Voice Calling Infrastructure
                </span>
              </div>

              {/* Bold Claim Headline */}
              <h1 className="display-title text-[var(--text)] tracking-tight">
                Calls that handle themselves.
              </h1>

              {/* One Clear Supporting Sentence */}
              <p className="text-lg md:text-xl text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
                Staff your phone operations with intelligent, conversational AI agents.
                Automate outbound campaigns, qualify leads, and book appointments over real carrier lines.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="w-full sm:w-auto"
                >
                  Start free campaign
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById('how-it-works');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto"
                >
                  See how it works
                </Button>
              </div>

              {/* Real Facts Technical Line */}
              <div className="pt-2 text-xs font-mono text-[var(--text-subtle)] flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <span>99.8% CARRIER DELIVERABILITY</span>
                <span>•</span>
                <span>OPENAI GPT-4 + WHISPER</span>
                <span>•</span>
                <span>REST & WEBSOCKET APIS</span>
              </div>
            </div>

            {/* Hero Live Mockup Console */}
            <div className="mt-14 max-w-4xl mx-auto">
              <MockupWindow
                title="call · live #VF-0482"
                statusBadge={
                  <StatusPill variant="live">
                    00:26 LIVE
                  </StatusPill>
                }
              >
                <div className="p-6 md:p-8 space-y-6 bg-[var(--surface-1)]">
                  {/* Call Meta Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)] text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[var(--text)]">
                          Marcus Vance
                        </div>
                        <div className="text-[var(--text-muted)]">
                          Target: +1 (415) 890-2341 · Goal: Appointment Booking
                        </div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[var(--accent)] font-semibold">
                        AUDIO ACTIVE · 380ms
                      </div>
                      <div className="text-[var(--text-subtle)]">
                        Twilio Voice Carrier Engine
                      </div>
                    </div>
                  </div>

                  {/* Real-time Waveform Display */}
                  <div className="bg-[var(--surface-2)]/60 p-4 rounded-[var(--r-md)] border border-[var(--border)]">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-subtle)] mb-2">
                      <span>VOICE SPECTRUM ANALYSIS</span>
                      <span className="text-[var(--accent)]">STEREO DUPLEX ACTIVE</span>
                    </div>
                    <Waveform active={true} height={46} bars={54} />
                  </div>

                  {/* Streaming Dialogue */}
                  <div className="bg-[var(--surface-2)]/30 p-4 rounded-[var(--r-md)] border border-[var(--border)]">
                    <div className="text-[11px] font-mono text-[var(--text-subtle)] mb-3">
                      STREAMING CALL TRANSCRIPT
                    </div>
                    <TranscriptStream lines={HERO_TRANSCRIPT} autoPlay={true} />
                  </div>

                  {/* Collapsed Outcome Card */}
                  <div className="flex items-center justify-between p-4 rounded-[var(--r-md)] bg-[var(--accent-soft)] border border-[var(--accent-ring)] text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                      <span className="font-medium text-[var(--text)]">
                        Outcome Confirmed: Appointment set for Tomorrow, 3:00 PM EST
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[var(--accent)] uppercase font-semibold">
                      SUCCESS
                    </span>
                  </div>
                </div>
              </MockupWindow>
            </div>
          </div>
        </section>

        {/* ── 6.3 Benefit Strip ──────────────────────────────────────────────── */}
        <section className="border-y border-[var(--border)] bg-[var(--surface-1)] py-12">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
              <div className="px-6 py-4 md:first:pl-0 space-y-2">
                <div className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
                  01 / SCALE
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Zero manual dialing queues.
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Reach hundreds or thousands of contacts simultaneously without human staffing bottlenecks.
                </p>
              </div>

              <div className="px-6 py-4 space-y-2">
                <div className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
                  02 / LATENCY
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Instant, interruptible rhythm.
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Callers can interrupt naturally at any point. The agent pauses immediately and updates context.
                </p>
              </div>

              <div className="px-6 py-4 md:last:pr-0 space-y-2">
                <div className="font-mono text-xs text-[var(--accent)] uppercase tracking-wider font-semibold">
                  03 / CONVERSION
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Direct calendar confirmations.
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Spoken agreements turn into scheduled appointments with automated SMS confirmations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6.4 How It Works ───────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6 space-y-16">
            <div className="max-w-2xl">
              <div className="micro-mono text-[var(--accent)] mb-3">WORKFLOW ARCHITECTURE</div>
              <h2 className="h2-title mb-4">How VoiceForge operates</h2>
              <p className="text-base text-[var(--text-muted)]">
                Three automated steps from agent script configuration to booked outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                    STEP 01
                  </span>
                  <div className="w-8 h-8 rounded-[var(--r-md)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  Configure Agent Script & Targets
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Define what your voice agent should achieve (appointment booking, qualification, feedback) and select your target contact list.
                </p>
                <div className="p-3 rounded-[var(--r-md)] bg-[var(--surface-2)] font-mono text-[11px] text-[var(--text-subtle)] border border-[var(--border)]">
                  {'campaign.setScript("Sarah", goal: "BOOK_APPOINTMENT")'}
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                    STEP 02
                  </span>
                  <div className="w-8 h-8 rounded-[var(--r-md)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]">
                    <Phone className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  Autonomous Outbound Calling
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  VoiceForge connects over carrier lines via Twilio, handling speech-to-text, reasoning, and text-to-speech with natural human tempo.
                </p>
                <div className="p-3 rounded-[var(--r-md)] bg-[var(--surface-2)] font-mono text-[11px] text-[var(--accent)] border border-[var(--border)]">
                  ● DUPLEX_STREAM: ACTIVE (12 Concurrent Calls)
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--accent)] font-semibold">
                    STEP 03
                  </span>
                  <div className="w-8 h-8 rounded-[var(--r-md)] bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  Outcome & Calendar Sync
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  View full live transcripts, sentiment scores, and auto-scheduled calendar appointments in your dashboard with instant notifications.
                </p>
                <div className="p-3 rounded-[var(--r-md)] bg-[var(--surface-2)] font-mono text-[11px] text-[var(--text-subtle)] border border-[var(--border)]">
                  {'status: "CONFIRMED" · sms: "DISPATCHED"'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6.5 Numbered Features 01–05 (Space-Style Centerpiece) ──────────── */}
        <section id="features" className="py-24 border-t border-[var(--border)] bg-[var(--surface-1)]/40 scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6 space-y-16">
            <div className="max-w-2xl">
              <div className="micro-mono text-[var(--accent)] mb-3">SYSTEM CAPABILITIES</div>
              <h2 className="h2-title mb-4">Precision phone engineering</h2>
              <p className="text-base text-[var(--text-muted)]">
                Built specifically for operations teams who require reliability, accuracy, and absolute control.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left: Numbered feature list */}
              <div className="lg:col-span-5 space-y-3">
                {FEATURES.map((feat, idx) => {
                  const isActive = activeFeatureIndex === idx;
                  return (
                    <div
                      key={feat.num}
                      onClick={() => setActiveFeatureIndex(idx)}
                      className={`p-5 rounded-[var(--r-lg)] border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--surface-2)] border-[var(--accent)] shadow-[0_0_20px_rgba(52,211,153,0.12)]'
                          : 'bg-[var(--surface-1)] border-[var(--border)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`font-mono text-xs font-semibold ${
                            isActive ? 'text-[var(--accent)]' : 'text-[var(--text-subtle)]'
                          }`}
                        >
                          {feat.num}
                        </span>
                        <h3 className="text-base font-semibold text-[var(--text)]">
                          {feat.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-7">
                        {feat.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right: Sticky Mockup Window */}
              <div className="lg:col-span-7 lg:sticky lg:top-24">
                <MockupWindow
                  title={FEATURES[activeFeatureIndex].mockupTitle}
                  statusBadge={
                    <StatusPill variant="live">
                      {FEATURES[activeFeatureIndex].badge}
                    </StatusPill>
                  }
                >
                  <div className="p-8 min-h-[380px] flex flex-col justify-between bg-[var(--surface-1)]">
                    {/* Dynamic feature mockup view */}
                    {activeFeatureIndex === 0 && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-3">
                          {FEATURES[0].content.metrics?.map((m) => (
                            <div
                              key={m.label}
                              className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-center"
                            >
                              <div className="text-base font-bold font-mono text-[var(--accent)]">
                                {m.value}
                              </div>
                              <div className="text-[11px] text-[var(--text-subtle)] mt-1">
                                {m.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--text-muted)] overflow-x-auto">
                          <pre>{FEATURES[0].content.codeSnippet}</pre>
                        </div>
                      </div>
                    )}

                    {activeFeatureIndex === 1 && (
                      <div className="space-y-6">
                        <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-[var(--text)]">
                              Campaign: Q4 Product Demo Outreach
                            </span>
                            <StatusPill variant="success">RUNNING</StatusPill>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-mono text-[var(--text-muted)]">
                              <span>Progress: 342 / 450 Calls Completed</span>
                              <span className="text-[var(--accent)]">78%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-[var(--surface-3)] overflow-hidden">
                              <div
                                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                                style={{ width: '78%' }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)]">
                            <div className="text-xl font-bold font-mono text-[var(--text)]">12</div>
                            <div className="text-xs text-[var(--text-muted)]">Active Lines Dialing</div>
                          </div>
                          <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)]">
                            <div className="text-xl font-bold font-mono text-[var(--accent)]">46</div>
                            <div className="text-xs text-[var(--text-muted)]">Appointments Secured</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFeatureIndex === 2 && (
                      <div className="space-y-4">
                        <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-[var(--text-subtle)]">
                              CALENDAR EVENT DETAILS
                            </span>
                            <StatusPill variant="live">CONFIRMED</StatusPill>
                          </div>
                          <div className="text-lg font-semibold text-[var(--text)]">
                            Product Demo Walkthrough
                          </div>
                          <div className="text-sm text-[var(--text-muted)]">
                            Thursday, 3:00 PM EST with Marcus Vance
                          </div>
                        </div>

                        <div className="p-4 rounded-[var(--r-md)] bg-[var(--accent-soft)] border border-[var(--accent-ring)] flex items-center justify-between text-xs">
                          <span className="text-[var(--text)]">
                            SMS Confirmation dispatched to +1 (415) 890-2341
                          </span>
                          <span className="font-mono text-[var(--accent)] font-semibold">
                            DELIVERED
                          </span>
                        </div>
                      </div>
                    )}

                    {activeFeatureIndex === 3 && (
                      <div className="space-y-4">
                        <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-[var(--text-subtle)]">
                              NATURAL LANGUAGE SENTIMENT
                            </span>
                            <StatusPill variant="success">POSITIVE (0.94)</StatusPill>
                          </div>
                          <p className="text-sm text-[var(--text)] leading-relaxed">
                            &ldquo;Customer expressed immediate interest in replacing manual phone triage with VoiceForge. Inquired about security compliance and Twilio credentials.&rdquo;
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
                            #InstantBooking
                          </span>
                          <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
                            #TwilioVoice
                          </span>
                          <span className="px-2.5 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--text-muted)]">
                            #HighIntent
                          </span>
                        </div>
                      </div>
                    )}

                    {activeFeatureIndex === 4 && (
                      <div className="space-y-4">
                        <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs space-y-2">
                          <div className="text-[var(--accent)] font-semibold">
                            REST & WEBSOCKET PROTOCOLS
                          </div>
                          <div className="text-[var(--text-muted)]">
                            POST /api/campaigns/create
                          </div>
                          <div className="text-[var(--text-muted)]">
                            POST /api/calls/initiate
                          </div>
                          <div className="text-[var(--text-muted)]">
                            WSS /api/websocket/stream
                          </div>
                        </div>

                        <div className="p-4 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between text-xs">
                          <span className="text-[var(--text)] font-medium">
                            Carrier Gateway: Twilio Programmable Voice
                          </span>
                          <span className="font-mono text-[var(--accent)]">ACTIVE</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[var(--text-subtle)]">
                      <span>VOICEFORGE ENGINE V2.0</span>
                      <span className="text-[var(--accent)]">CONNECTED</span>
                    </div>
                  </div>
                </MockupWindow>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6.6 Use Cases ──────────────────────────────────────────────────── */}
        <section id="use-cases" className="py-24 scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6 space-y-16">
            <div className="max-w-2xl">
              <div className="micro-mono text-[var(--accent)] mb-3">APPLICATIONS</div>
              <h2 className="h2-title mb-4">Built for high-volume phone operations</h2>
              <p className="text-base text-[var(--text-muted)]">
                Replace manual phone grunt work with reliable, consistent AI callers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USE_CASES.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <Card key={useCase.title} interactive className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="micro-mono text-[var(--accent)]">
                        {useCase.category}
                      </span>
                      <div className="w-9 h-9 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text)]">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                      {useCase.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6.7 Trust / Under-the-hood ─────────────────────────────────────── */}
        <section className="py-20 border-y border-[var(--border)] bg-[var(--surface-1)]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <div className="micro-mono text-[var(--accent)]">BUILT FOR RELIABILITY</div>
              <h2 className="h2-title">Enterprise telephone architecture</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Zero black-box mystery. Fully inspectable calls, transcripts, audio recordings, and webhook dispatches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-[var(--r-lg)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="text-2xl font-bold font-mono text-[var(--text)]">100%</div>
                <div className="text-xs font-semibold text-[var(--text)]">Transcribed Calls</div>
                <div className="text-xs text-[var(--text-muted)]">Word-for-word Whisper transcripts</div>
              </div>

              <div className="p-6 rounded-[var(--r-lg)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="text-2xl font-bold font-mono text-[var(--accent)]">&lt; 500ms</div>
                <div className="text-xs font-semibold text-[var(--text)]">Turnaround Latency</div>
                <div className="text-xs text-[var(--text-muted)]">Fluid human conversation tempo</div>
              </div>

              <div className="p-6 rounded-[var(--r-lg)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="text-2xl font-bold font-mono text-[var(--text)]">Twilio</div>
                <div className="text-xs font-semibold text-[var(--text)]">Carrier Integration</div>
                <div className="text-xs text-[var(--text-muted)]">Programmable voice and SMS lines</div>
              </div>

              <div className="p-6 rounded-[var(--r-lg)] bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                <div className="text-2xl font-bold font-mono text-[var(--accent)]">PostgreSQL</div>
                <div className="text-xs font-semibold text-[var(--text)]">Prisma ORM</div>
                <div className="text-xs text-[var(--text-muted)]">Persistent logs, analytics & CRM</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6.8 Pricing / Plans ────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 scroll-mt-20">
          <div className="max-w-[1200px] mx-auto px-6 space-y-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="micro-mono text-[var(--accent)]">TRANSPARENT PLANS</div>
              <h2 className="h2-title">Simple pricing for teams of all sizes</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Deploy autonomous voice agents without per-seat human overhead.
              </p>

              {/* Monthly / Annual Toggle */}
              <div className="inline-flex items-center gap-3 p-1 rounded-[var(--r-full)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsAnnualPricing(false)}
                  className={`px-3 py-1 rounded-[var(--r-full)] transition-colors ${
                    !isAnnualPricing
                      ? 'bg-[var(--surface-3)] text-[var(--text)] font-semibold'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnualPricing(true)}
                  className={`px-3 py-1 rounded-[var(--r-full)] transition-colors ${
                    isAnnualPricing
                      ? 'bg-[var(--surface-3)] text-[var(--text)] font-semibold'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  Annual (20% off)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Starter Plan */}
              <Card className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">Starter</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">For small teams testing voice outreach.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[var(--text)]">
                    {isAnnualPricing ? '$39' : '$49'}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> 500 calling minutes / month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Automated appointment booking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Real-time Whisper transcripts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> 2 concurrent voice lines
                  </li>
                </ul>
                <Button variant="secondary" className="w-full justify-center" onClick={() => router.push('/register')}>
                  Get started
                </Button>
              </Card>

              {/* Pro Plan (Highlighted by border) */}
              <Card className="p-8 space-y-6 border-[var(--accent)] shadow-[0_0_24px_rgba(52,211,153,0.15)] relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-[var(--r-full)] bg-[var(--accent)] text-[var(--accent-ink)] font-mono text-[10px] font-bold uppercase tracking-wider">
                  Recommended
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">Growth</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">For scaling outbound calling campaigns.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[var(--text)]">
                    {isAnnualPricing ? '$119' : '$149'}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">/month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> 2,500 calling minutes / month
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> 10 concurrent voice lines
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Sentiment analysis & analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Custom voice prompts & Twilio BYO
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Webhook API integration
                  </li>
                </ul>
                <Button variant="accent" className="w-full justify-center" onClick={() => router.push('/register')}>
                  Start free trial
                </Button>
              </Card>

              {/* Enterprise Plan */}
              <Card className="p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">Enterprise</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">For custom volume & dedicated infrastructure.</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-[var(--text)]">Custom</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Unlimited calling volume
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Dedicated carrier trunking
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> Custom LLM model fine-tuning
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> 99.9% uptime SLA guarantee
                  </li>
                </ul>
                <Button variant="secondary" className="w-full justify-center" onClick={() => router.push('/register')}>
                  Contact sales
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* ── 6.9 FAQ Section ────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 border-t border-[var(--border)] bg-[var(--surface-1)]/30 scroll-mt-20">
          <div className="max-w-3xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <div className="micro-mono text-[var(--accent)]">FREQUENTLY ASKED QUESTIONS</div>
              <h2 className="h2-title">Frequently asked questions</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Everything you need to know about VoiceForge autonomous voice operations.
              </p>
            </div>

            <Accordion>
              <AccordionItem title="How does VoiceForge achieve low conversational latency?" defaultOpen>
                VoiceForge utilizes duplex WebSocket streaming between the Twilio telephony carrier and OpenAI Whisper audio models. Speech is transcribed and processed in streaming chunks, enabling responses within 400 milliseconds.
              </AccordionItem>

              <AccordionItem title="Can callers interrupt the agent while it is speaking?">
                Yes. Full duplex audio streaming monitors incoming speech while the agent is talking. As soon as the caller speaks, playback halts immediately and the agent processes the interruption naturally.
              </AccordionItem>

              <AccordionItem title="Can I bring my own Twilio phone numbers?">
                Yes. You can supply your own Twilio Account SID, Auth Token, and phone numbers in the environment configuration, or use numbers provisioned directly through VoiceForge.
              </AccordionItem>

              <AccordionItem title="How does automated appointment booking work?">
                During the call, the AI agent confirms a mutually acceptable date and time with the customer. Once confirmed, VoiceForge saves the appointment directly to the database and triggers an SMS confirmation to the customer&apos;s phone.
              </AccordionItem>

              <AccordionItem title="Can I customize what the AI agent says?">
                Yes. In the Campaigns dashboard, you can author custom scripts, specify the agent persona, define tone and goal types (Appointment, Lead Qualification, Feedback, Support), and provide guidance for objections.
              </AccordionItem>

              <AccordionItem title="How is call data and privacy handled?">
                All call logs, transcripts, and customer records are securely stored in your private PostgreSQL database. Sensitive credentials and phone numbers are encrypted at rest.
              </AccordionItem>

              <AccordionItem title="Where can I see live calls happening in real-time?">
                Inside the VoiceForge dashboard, the Calls and Dashboard views receive real-time updates via WebSockets, allowing you to monitor active call durations, transcripts, and statuses dynamically.
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* ── 6.10 Final CTA ─────────────────────────────────────────────────── */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] hero-glow pointer-events-none" />

          <div className="relative max-w-[1200px] mx-auto px-6 text-center space-y-6">
            <div className="micro-mono text-[var(--accent)]">GET STARTED TODAY</div>
            <h2 className="display-title text-[var(--text)]">
              Ready to put your phone line on autopilot?
            </h2>
            <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
              Launch your first automated AI calling campaign in under five minutes. Qualify leads and secure appointments with zero manual dialing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="accent"
                size="lg"
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto"
              >
                Create free account
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto"
              >
                Sign in to console
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── 6.11 Footer ────────────────────────────────────────────────────── */}
      <MarketingFooter />
    </div>
  );
}
