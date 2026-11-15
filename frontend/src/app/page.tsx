'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { Waveform } from '@/components/ui/waveform';
import { TranscriptStream, TranscriptLine } from '@/components/ui/transcript-stream';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import {
  Mic,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Zap,
  Clock,
  MessageSquare,
  Layers,
  Check,
  PhoneCall,
  Activity,
  Shield,
  Radio,
} from 'lucide-react';

// ── Sample Live Demo Transcript ──────────────────────────────────────────────
const HERO_TRANSCRIPT: TranscriptLine[] = [
  {
    speaker: 'AGENT',
    text: 'Good afternoon Marcus! This is Sarah from VoiceForge. I am following up on your request for an automated calling demonstration. Do you have two minutes?',
    time: '0:02',
  },
  {
    speaker: 'CALLER',
    text: 'Hi Sarah. Yes, I do. Does your system support instant appointment booking directly into our calendar?',
    time: '0:07',
  },
  {
    speaker: 'AGENT',
    text: 'Yes, absolutely. During the call, I check real-time calendar availability, confirm the chosen slot with you, and send an SMS confirmation immediately. Would tomorrow at 3 PM work for a live test?',
    time: '0:14',
  },
  {
    speaker: 'CALLER',
    text: 'Tomorrow at 3 PM works perfectly for me. Lock that in.',
    time: '0:20',
  },
  {
    speaker: 'AGENT',
    text: 'Confirmed! You are scheduled for tomorrow at 3:00 PM EST. I have just triggered your confirmation SMS.',
    time: '0:24',
  },
];

// ── Space-Style Features 01–05 Data ─────────────────────────────────────────
const SPACE_FEATURES = [
  {
    num: '01',
    title: 'Real-time conversational cadence',
    description:
      'Human-speed voice turnaround powered by OpenAI GPT-4 and Whisper speech recognition. Responds within 420 milliseconds with full natural speech interruptibility.',
  },
  {
    num: '02',
    title: 'Autonomous outbound campaigns',
    description:
      'Launch hundreds of targeted customer calls simultaneously. Automate lead qualification, schedule follow-ups, and reach pipeline targets without manual dialing.',
  },
  {
    num: '03',
    title: 'Instant calendar confirmations',
    description:
      'Turn spoken agreements into scheduled appointments. VoiceForge validates real-time calendar availability and dispatches automated SMS confirmations via Twilio.',
  },
  {
    num: '04',
    title: 'Word-for-word Whisper transcripts',
    description:
      'Every conversation is transcribed and preserved with timestamped dialogue and automated sentiment analysis to gauge caller satisfaction instantly.',
  },
  {
    num: '05',
    title: 'Carrier telephony & live WebSockets',
    description:
      'Engineered directly on Twilio programmable voice infrastructure with WebSocket duplex streaming, ensuring 99.8% carrier deliverability and real-time dashboard updates.',
  },
];

// ── Use Cases Data ────────────────────────────────────────────────────────────
const USE_CASES = [
  {
    category: 'LEAD GENERATION',
    title: 'Qualify inbound & outbound leads instantly.',
    description:
      'Engage leads seconds after they submit a form. Qualify intent, answer common inquiries, and route high-value prospects immediately.',
    metric: '3.8x faster response time',
  },
  {
    category: 'SCHEDULING',
    title: 'Fill sales calendars without email back-and-forth.',
    description:
      'Call prospective clients, determine scheduling fit, and secure booked appointments directly into your team calendar.',
    metric: '82% confirmation rate',
  },
  {
    category: 'CUSTOMER CARE',
    title: 'Automated appointment reminders & confirmations.',
    description:
      'Cut no-show rates by placing courteous automated reminder calls that allow clients to confirm, reschedule, or cancel with their voice.',
    metric: '45% reduction in no-shows',
  },
  {
    category: 'FEEDBACK & CSAT',
    title: 'Collect authentic customer feedback at scale.',
    description:
      'Conduct friendly post-service feedback calls with natural open-ended conversations and automatic sentiment detection.',
    metric: '94% positive sentiment capture',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isAnnualPricing, setIsAnnualPricing] = React.useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 selection:bg-white selection:text-black">
      {/* ── Space-Style Floating Pill Navbar ─────────────────────────────────── */}
      <MarketingNavbar />

      <main className="relative pt-28 sm:pt-36">
        {/* ── Hero Section (Space-Style Typographic Hierarchy) ────────────────── */}
        <section className="relative px-5 sm:px-8 lg:px-10 pb-20 sm:pb-28">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[var(--text-muted)] select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
              <span className="text-[var(--text)] font-medium">Live Voice Engine</span>
              <span className="text-white/20">/</span>
              <span>Autonomous Phone Operations</span>
            </div>

            {/* Confident Two-Tier Headline */}
            <h1 className="text-[clamp(40px,7.5vw,76px)] leading-[1.02] tracking-[-0.035em] text-balance">
              <span className="block font-medium text-[var(--text)]">Your phone line,</span>
              <span className="block font-normal text-[var(--text-muted)]">staffed by AI.</span>
            </h1>

            {/* Restrained, Concrete Subhead */}
            <p className="mx-auto max-w-[32rem] text-base sm:text-lg text-[var(--text-muted)] leading-relaxed text-pretty">
              Instant voice conversations over real carrier lines. Automate outbound campaigns,
              qualify inbound leads, and secure calendar appointments with zero human hold time.
            </p>

            {/* CTAs (Space Style: Crisp White Pill Button) */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all shadow-sm gap-2"
              >
                Start free campaign
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('demo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all"
              >
                See call demo
              </button>
            </div>

            {/* Technical Metadata Line */}
            <p className="text-xs text-[var(--text-subtle)] font-mono tracking-wider pt-2">
              TWILIO CARRIER BACKBONE · OPENAI GPT-4 & WHISPER · WEBSOCKET DUPLEX STREAMING
            </p>
          </div>
        </section>

        {/* ── Product Demo Hero Window (The Product is the Hero) ──────────────── */}
        <section id="demo" className="relative px-5 sm:px-8 lg:px-10 pb-28 scroll-mt-24">
          <div className="mx-auto max-w-5xl">
            {/* Section Header */}
            <div className="mx-auto max-w-3xl text-center mb-10 space-y-3">
              <h2 className="text-[clamp(30px,4vw,48px)] leading-[1.04] tracking-[-0.03em] text-balance">
                <span className="block font-medium text-[var(--text)]">Thousands of calls.</span>
                <span className="block font-normal text-[var(--text-muted)]">Zero hold times.</span>
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-lg mx-auto">
                Watch how VoiceForge handles speech interruptions, transcribes dialogue in real time, and writes confirmed appointments directly to your database.
              </p>
            </div>

            {/* Space-Style Precision Console Window */}
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-1)] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
              {/* Window Chrome Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-2)]/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="font-mono text-xs text-[var(--text-subtle)] tracking-wider">
                  call · live #VF-0482
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
                    00:26 ACTIVE
                  </span>
                </div>
              </div>

              {/* Console Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Caller & Connection Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)] text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text)]">
                      <Mic className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[var(--text)]">Marcus Vance</div>
                      <div className="text-[var(--text-subtle)]">+1 (415) 890-2341 · Goal: Appointment Booking</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-emerald-400 font-medium">AUDIO DUPLEX · 380ms</div>
                    <div className="text-[var(--text-subtle)]">Carrier: Twilio Voice</div>
                  </div>
                </div>

                {/* Live Waveform Spectrum */}
                <div className="bg-[var(--surface-2)]/60 p-4 rounded-xl border border-[var(--border)]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-subtle)] mb-2">
                    <span>SPEECH FREQUENCY SPECTRUM</span>
                    <span className="text-emerald-400">ACTIVE STEREO STREAM</span>
                  </div>
                  <Waveform active={true} height={44} bars={52} />
                </div>

                {/* Streaming Transcript Dialogue */}
                <div className="bg-[var(--surface-2)]/30 p-4 rounded-xl border border-[var(--border)]">
                  <div className="text-[11px] font-mono text-[var(--text-subtle)] mb-3">
                    STREAMING TRANSCRIPT (WHISPER + GPT-4)
                  </div>
                  <TranscriptStream lines={HERO_TRANSCRIPT} autoPlay={true} />
                </div>

                {/* Outcome Badge Card */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-medium text-[var(--text)]">
                      Outcome Confirmed: Appointment set for Tomorrow, 3:00 PM EST
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400 uppercase font-semibold">
                    SUCCESS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Space-Style Numbered Features (01–05 Horizontal Rows) ───────────── */}
        <section id="features" className="relative px-5 sm:px-8 lg:px-10 py-24 border-t border-[var(--border)] scroll-mt-20">
          <div className="mx-auto max-w-[1280px]">
            {/* Header */}
            <div className="max-w-2xl mb-14 space-y-3">
              <h2 className="text-[clamp(32px,4.4vw,54px)] leading-[1.04] font-medium tracking-[-0.03em] text-[var(--text)]">
                Never wait on a call transfer again
              </h2>
              <p className="text-base text-[var(--text-muted)] leading-relaxed">
                VoiceForge executes phone conversations in real time with natural human cadence, instant interruptibility, and automated CRM logging.
              </p>
            </div>

            {/* The Space-Style Numbered Rows */}
            <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {SPACE_FEATURES.map((feat) => (
                <div
                  key={feat.num}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 py-8 sm:grid-cols-[3.5rem_minmax(0,1fr)] lg:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-x-10 transition-colors"
                >
                  <span className="text-[var(--text-subtle)] pt-1 font-mono text-xs sm:text-sm lg:pt-0">
                    {feat.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-[28px] font-medium tracking-tight text-[var(--text)] transition-transform duration-300 ease-out lg:group-hover:translate-x-2">
                    {feat.title}
                  </h3>
                  <p className="col-start-2 mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[var(--text-muted)] transition-colors duration-300 lg:col-start-3 lg:mt-0 lg:group-hover:text-[var(--text)]">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6.4 How It Works (3 Clear Operational Steps) ───────────────────── */}
        <section id="how-it-works" className="relative px-5 sm:px-8 lg:px-10 py-24 bg-[var(--surface-1)]/30 border-t border-[var(--border)] scroll-mt-20">
          <div className="mx-auto max-w-[1280px] space-y-16">
            <div className="max-w-2xl space-y-3">
              <div className="micro-mono text-[var(--text-subtle)]">WORKFLOW</div>
              <h2 className="text-[clamp(30px,4vw,48px)] leading-[1.04] font-medium tracking-[-0.03em] text-[var(--text)]">
                Three automated steps
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)]">
                From script definition to confirmed calendar bookings with zero human effort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-1)] p-7 space-y-4">
                <span className="font-mono text-xs text-[var(--text-subtle)]">STEP 01</span>
                <h3 className="text-lg font-medium text-[var(--text)]">
                  Configure Agent Script & Goals
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Author your custom voice prompt, set your campaign target (Appointment, Qualification, Feedback), and select target contacts.
                </p>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] font-mono text-[11px] text-[var(--text-subtle)] border border-[var(--border)]">
                  campaign.setGoal(&quot;BOOK_APPOINTMENT&quot;)
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-1)] p-7 space-y-4">
                <span className="font-mono text-xs text-[var(--text-subtle)]">STEP 02</span>
                <h3 className="text-lg font-medium text-[var(--text)]">
                  Autonomous Outbound Calling
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  VoiceForge connects over carrier lines via Twilio, handling streaming speech recognition, reasoning, and speech synthesis.
                </p>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] font-mono text-[11px] text-emerald-400 border border-[var(--border)]">
                  ● DUPLEX_STREAM: ACTIVE (12 Concurrent Lines)
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-1)] p-7 space-y-4">
                <span className="font-mono text-xs text-[var(--text-subtle)]">STEP 03</span>
                <h3 className="text-lg font-medium text-[var(--text)]">
                  Calendar & CRM Sync
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  Spoken agreements turn into confirmed calendar bookings with word-for-word transcripts, sentiment scores, and SMS confirmation.
                </p>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] font-mono text-[11px] text-[var(--text-subtle)] border border-[var(--border)]">
                  {`appointment.sync({ status: "CONFIRMED" })`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Space-Style Use Cases (Built for Every Kind of Work) ─────────────── */}
        <section id="use-cases" className="relative px-5 sm:px-8 lg:px-10 py-24 border-t border-[var(--border)] scroll-mt-20">
          <div className="mx-auto max-w-[1280px] space-y-16">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-[clamp(32px,4.4vw,54px)] leading-[1.04] font-medium tracking-[-0.03em] text-[var(--text)]">
                Built for every phone operation
              </h2>
              <p className="text-base text-[var(--text-muted)]">
                Replace repetitive phone triage with reliable, consistent AI callers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {USE_CASES.map((uc) => (
                <div
                  key={uc.title}
                  className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-1)] p-8 space-y-4 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-subtle)]">
                    <span>{uc.category}</span>
                    <span className="text-emerald-400 font-medium">{uc.metric}</span>
                  </div>
                  <h3 className="text-xl font-medium text-[var(--text)] tracking-tight">
                    {uc.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {uc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Architecture / Infrastructure ──────────────────────────────────── */}
        <section className="relative px-5 sm:px-8 lg:px-10 py-20 border-t border-[var(--border)] bg-[var(--surface-1)]/40">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
                Carrier-grade telecommunication architecture
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                Engineered for enterprise latency, privacy, and full data inspectability.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">
                <div className="text-2xl font-bold font-mono text-[var(--text)]">99.8%</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Carrier Deliverability</div>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">
                <div className="text-2xl font-bold font-mono text-emerald-400">&lt; 450ms</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Voice Turnaround</div>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">
                <div className="text-2xl font-bold font-mono text-[var(--text)]">Twilio</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Voice Backbone</div>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]">
                <div className="text-2xl font-bold font-mono text-[var(--text)]">Postgres</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Encrypted Logs</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Tiers (Space Style: Simple & Clean) ──────────────────────── */}
        <section id="pricing" className="relative px-5 sm:px-8 lg:px-10 py-24 border-t border-[var(--border)] scroll-mt-20">
          <div className="mx-auto max-w-5xl space-y-14">
            <div className="text-center max-w-xl mx-auto space-y-4">
              <h2 className="text-[clamp(32px,4vw,48px)] leading-[1.04] font-medium tracking-[-0.03em] text-[var(--text)]">
                Simple pricing
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Start with a free trial. Scale volume as your phone operations expand.
              </p>

              {/* Monthly / Annual Toggle */}
              <div className="inline-flex items-center gap-2 p-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setIsAnnualPricing(false)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    !isAnnualPricing ? 'bg-white text-black font-medium' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnualPricing(true)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    isAnnualPricing ? 'bg-white text-black font-medium' : 'text-[var(--text-muted)]'
                  }`}
                >
                  Annual (20% off)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Individual / Starter */}
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-1)] p-7 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text)]">Individual</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">For testing voice automation.</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-[var(--text)]">
                      {isAnnualPricing ? '$39' : '$49'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">/month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> 500 call minutes / month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> Instant appointment booking
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> Real-time Whisper transcripts
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> 2 concurrent voice lines
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-2.5 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  Start free trial
                </button>
              </div>

              {/* Teams / Growth */}
              <div className="rounded-[24px] border border-white/30 bg-[var(--surface-1)] p-7 space-y-6 flex flex-col justify-between shadow-xl relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-white text-black font-mono text-[10px] font-semibold uppercase tracking-wider">
                  Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text)]">Teams</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">For scaling outbound phone pipelines.</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-[var(--text)]">
                      {isAnnualPricing ? '$119' : '$149'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">/month</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> 2,500 call minutes / month
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> 10 concurrent voice lines
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Sentiment analysis & analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Custom voice prompts & scripts
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> SMS confirmations via Twilio
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-2.5 rounded-full bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  Get started
                </button>
              </div>

              {/* Enterprise */}
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-1)] p-7 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text)]">Enterprise</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">For custom volume and BYO carrier.</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono text-[var(--text)]">Custom</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> Unlimited call volume
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> Dedicated carrier trunking
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> Bring-your-own Twilio account
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[var(--text)]" /> 99.9% uptime SLA guarantee
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => router.push('/register')}
                  className="w-full py-2.5 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  Contact team
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ (Common Questions) ─────────────────────────────────────────── */}
        <section id="faq" className="relative px-5 sm:px-8 lg:px-10 py-24 border-t border-[var(--border)] scroll-mt-20">
          <div className="mx-auto max-w-3xl space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-[clamp(30px,4vw,44px)] font-medium tracking-tight text-[var(--text)]">
                Common questions
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                Everything you need to know about VoiceForge autonomous voice operations.
              </p>
            </div>

            <Accordion>
              <AccordionItem title="How does VoiceForge achieve low conversational latency?" defaultOpen>
                VoiceForge utilizes duplex WebSocket streaming between the Twilio telephony carrier and OpenAI Whisper audio models. Speech is transcribed and processed in streaming chunks, enabling voice turnaround within 420 milliseconds.
              </AccordionItem>

              <AccordionItem title="Can callers interrupt the agent while it is speaking?">
                Yes. Full duplex audio streaming monitors incoming speech while the agent is talking. As soon as the caller speaks, playback halts immediately and the agent processes the interruption naturally without robotic lag.
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

        {/* ── Final Call to Action ────────────────────────────────────────────── */}
        <section className="relative px-5 sm:px-8 lg:px-10 py-28 border-t border-[var(--border)] text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-[clamp(36px,5.5vw,60px)] leading-[1.04] font-medium tracking-[-0.035em] text-[var(--text)]">
              Ready to journey into autonomous calling?
            </h2>
            <p className="text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
              Launch your first calling campaign in under five minutes. Qualify leads and secure appointments with zero manual dialing.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push('/register')}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all shadow-sm gap-2"
              >
                Create free account
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-medium border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] active:scale-[0.98] transition-all"
              >
                Sign in to console
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <MarketingFooter />
    </div>
  );
}
