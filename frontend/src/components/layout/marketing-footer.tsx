'use client';

import * as React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-1)] py-16 text-sm">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-base text-[var(--text)]">VoiceForge</span>
            </Link>
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">
              Autonomous AI phone operations for outbound campaigns, inbound triage, and real-time scheduling.
            </p>
          </div>

          {/* Product */}
          <div>
            <h5 className="font-mono text-xs uppercase tracking-wider text-[var(--text-subtle)] mb-4">
              Product
            </h5>
            <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
              <li><Link href="/#features" className="hover:text-[var(--text)] transition-colors">Features</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[var(--text)] transition-colors">How it works</Link></li>
              <li><Link href="/#use-cases" className="hover:text-[var(--text)] transition-colors">Use cases</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--text)] transition-colors">Console</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-mono text-xs uppercase tracking-wider text-[var(--text-subtle)] mb-4">
              Resources
            </h5>
            <ul className="space-y-2.5 text-xs text-[var(--text-muted)]">
              <li><Link href="/#faq" className="hover:text-[var(--text)] transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="hover:text-[var(--text)] transition-colors">About</Link></li>
              <li><Link href="/login" className="hover:text-[var(--text)] transition-colors">Sign in</Link></li>
              <li><Link href="/register" className="hover:text-[var(--text)] transition-colors">Create account</Link></li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div>
            <h5 className="font-mono text-xs uppercase tracking-wider text-[var(--text-subtle)] mb-4">
              Infrastructure
            </h5>
            <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-3">
              Engineered with NestJS, OpenAI GPT-4, Whisper transcription, and Twilio carrier routing.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-live-pulse" />
              <span className="font-mono text-[11px] text-[var(--accent)]">
                Carrier Signal Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-subtle)]">
          <div>
            © {new Date().getFullYear()} VoiceForge AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">System Status: Operational</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}

