'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { Card } from '@/components/ui/card';
import { Target, BarChart3, ShieldCheck, ArrowRight, Phone } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 flex flex-col justify-between">
      <MarketingNavbar />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex-1 w-full space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="micro-mono text-[var(--accent)]">OUR MISSION</div>
          <h1 className="h1-title text-[var(--text)]">About VoiceForge</h1>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Empowering businesses with autonomous voice operations powered by OpenAI GPT-4, Whisper speech synthesis, and carrier-grade telephony.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 border-[var(--border)] bg-[var(--surface-1)]">
            <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text)]">Autonomous Operations</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Create and deploy AI voice agents that speak, listen, and understand customer intent without rigid IVR phone trees.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-[var(--border)] bg-[var(--surface-1)]">
            <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text)]">Real-Time Intelligence</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every conversation is transcribed with live sentiment metrics, duration stats, and automated calendar scheduling.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-[var(--border)] bg-[var(--surface-1)]">
            <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text)]">Carrier Grade Security</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Twilio programmable voice backbone with private database records, end-to-end encryption, and complete control over phone numbers.
            </p>
          </Card>
        </div>

        <div className="p-8 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface-1)] text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[var(--text)]">Ready to test VoiceForge?</h2>
          <p className="text-xs text-[var(--text-muted)]">
            Configure your first agent script in five minutes.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => router.push('/register')}
            >
              Get started free
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
