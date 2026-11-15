'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { Card, CardContent } from '@/components/ui/card';
import { MockupWindow } from '@/components/ui/mockup-window';
import { Waveform } from '@/components/ui/waveform';
import { TranscriptStream } from '@/components/ui/transcript-stream';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { EmptyState } from '@/components/ui/empty-state';
import { Phone, ArrowLeft, Mic, CheckCircle2 } from 'lucide-react';

export default function DesignShowcasePage() {
  const [activeTab, setActiveTab] = React.useState('live');
  const [waveActive, setWaveActive] = React.useState(true);

  const sampleTranscript = [
    { speaker: 'AGENT' as const, text: 'Hello! This is Sarah calling from VoiceForge. Am I speaking with Alex?', time: '0:02' },
    { speaker: 'CALLER' as const, text: 'Yes, hi Sarah. What is this regarding?', time: '0:06' },
    { speaker: 'AGENT' as const, text: 'I noticed your team requested a demonstration of our outbound calling infrastructure. Would Thursday at 2 PM work for a brief 15-minute walk-through?', time: '0:12' },
    { speaker: 'CALLER' as const, text: 'Thursday at 2 PM works perfectly for me.', time: '0:18' },
    { speaker: 'AGENT' as const, text: 'Excellent! I have confirmed your appointment for Thursday at 2 PM. You will receive an SMS confirmation shortly.', time: '0:22' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 p-6 md:p-12">
      <div className="max-w-[1200px] mx-auto space-y-16">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Homepage
              </Link>
            </div>
            <h1 className="h1-title">VoiceForge Design System</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Component & token verification per DESIGN.md specifications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[var(--text-muted)]">Theme:</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Section 1: Hero Call Console Mockup */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">01. Live Call Console Mockup</h2>
            <button
              onClick={() => setWaveActive(!waveActive)}
              className="text-xs font-mono text-[var(--accent)] hover:underline"
            >
              Toggle Waveform: {waveActive ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>

          <MockupWindow
            title="call · live #VF-8921"
            tabs={['live stream', 'parameters', 'audio log']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            statusBadge={
              <StatusPill variant="live">
                02:14 LIVE
              </StatusPill>
            }
            className="max-w-3xl mx-auto"
          >
            <div className="p-6 md:p-8 space-y-6">
              {/* Call Header Metadata */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-[var(--accent)]">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)]">Alex Mercer</div>
                    <div className="text-[var(--text-subtle)]">+1 (415) 890-2341</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[var(--accent)]">CONNECTED · 120ms</div>
                  <div className="text-[var(--text-subtle)]">Carrier: Twilio Voice</div>
                </div>
              </div>

              {/* Animated Waveform */}
              <div className="bg-[var(--surface-2)]/50 p-4 rounded-[var(--r-md)] border border-[var(--border)]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-subtle)] mb-2">
                  <span>VOICE FREQUENCY SPECTRUM</span>
                  <span className="text-[var(--accent)]">LIVE AUDIO RX/TX</span>
                </div>
                <Waveform active={waveActive} height={44} bars={52} />
              </div>

              {/* Streaming Transcript */}
              <div className="bg-[var(--surface-2)]/30 p-4 rounded-[var(--r-md)] border border-[var(--border)]">
                <div className="text-[11px] font-mono text-[var(--text-subtle)] mb-3">
                  REAL-TIME TRANSCRIPT (OPENAI WHISPER)
                </div>
                <TranscriptStream lines={sampleTranscript} autoPlay={false} />
              </div>

              {/* Outcome summary card */}
              <div className="flex items-center justify-between p-3.5 rounded-[var(--r-md)] bg-[var(--accent-soft)] border border-[var(--accent-ring)]/50 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                  <span className="font-medium text-[var(--text)]">
                    Goal Achieved: Appointment Confirmed for Thursday 2:00 PM
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[var(--accent)] uppercase font-semibold">
                  CONFIRMED
                </span>
              </div>
            </div>
          </MockupWindow>
        </section>

        {/* Section 2: Buttons & Actions */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">02. Buttons (Tokens & States)</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[var(--text-subtle)] uppercase">Button Variants</div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="accent">Hero Accent CTA</Button>
                  <Button variant="primary">Primary Inverted</Button>
                  <Button variant="secondary">Secondary Surface</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost Action</Button>
                  <Button variant="danger">Danger Zone</Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono text-[var(--text-subtle)] uppercase">Sizes & Loading State</div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="secondary">Small 32px</Button>
                  <Button size="md" variant="secondary">Medium 40px</Button>
                  <Button size="lg" variant="accent">Large 48px</Button>
                  <Button size="md" variant="primary" isLoading>Submitting...</Button>
                  <Button size="md" variant="secondary" disabled>Disabled State</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Status Pills */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">03. Status Pills</h2>
          <Card>
            <CardContent className="p-6 flex flex-wrap gap-4 items-center">
              <StatusPill variant="live">LIVE CALLING</StatusPill>
              <StatusPill variant="success">COMPLETED</StatusPill>
              <StatusPill variant="warning">RINGING / QUEUED</StatusPill>
              <StatusPill variant="danger">FAILED / BUSY</StatusPill>
              <StatusPill variant="neutral">STANDBY</StatusPill>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Form Controls & Inputs */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">04. Form Controls</h2>
          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)]">Standard Input</label>
                <Input placeholder="Enter campaign name..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)]">Mono Phone Field</label>
                <Input isMono defaultValue="+1 (555) 234-5678" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--text-muted)]">With Error Validation</label>
                <Input defaultValue="invalid-email" error="Please enter a valid email address" />
                <p className="text-xs text-[var(--danger)]">Please enter a valid email address</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 5: Accordion & FAQ */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">05. Accordion (FAQ Pattern)</h2>
          <Card>
            <CardContent className="p-6">
              <Accordion>
                <AccordionItem title="How does the AI voice engine achieve low latency?" defaultOpen>
                  VoiceForge pipelines audio streaming through WebSocket connections directly into Whisper transcription and streaming GPT-4 completion, achieving sub-second voice turnaround over standard carrier lines.
                </AccordionItem>
                <AccordionItem title="Can I bring my own Twilio phone numbers?">
                  Yes. You can connect your existing Twilio account credentials or use your provisioned VoiceForge phone lines out of the box.
                </AccordionItem>
                <AccordionItem title="How are appointments and call transcripts stored?">
                  All audio transcripts, booked calendar dates, and customer sentiments are securely persisted in PostgreSQL with complete call timeline records.
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Empty State */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">06. Empty State</h2>
          <EmptyState
            icon={Phone}
            title="No call logs recorded"
            description="Launch an automated outbound campaign or place a test call to see live transcripts and analytics here."
            actionLabel="Start Campaign"
            onAction={() => {}}
          />
        </section>
      </div>
    </div>
  );
}

