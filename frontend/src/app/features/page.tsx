'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MarketingNavbar } from '@/components/layout/marketing-navbar';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { Card } from '@/components/ui/card';
import { Target, BarChart3, ShieldCheck, Phone, Calendar, Brain, ArrowRight } from 'lucide-react';

const FEATURE_CARDS = [
  {
    icon: Target,
    title: 'Smart Campaigns',
    description: 'Create and launch automated calling campaigns with targeted audience filters and customizable voice prompts.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track conversion metrics, sentiment distribution, and hourly volume with live WebSocket streaming.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Carrier Routing',
    description: 'Twilio programmable voice infrastructure ensuring 99.8% call deliverability and low latency audio.',
  },
  {
    icon: Phone,
    title: 'Inbound & Outbound Handling',
    description: 'Seamlessly dial outbound call batches or handle incoming customer calls with conversational intelligence.',
  },
  {
    icon: Calendar,
    title: 'Automated Calendar Bookings',
    description: 'Detect scheduling intent during calls, confirm open slots, and dispatch instant SMS appointment notifications.',
  },
  {
    icon: Brain,
    title: 'Custom AI Knowledge Base',
    description: 'Train your agent with company FAQs and objection guidelines to handle complex inquiries naturally.',
  },
];

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 flex flex-col justify-between">
      <MarketingNavbar />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20 flex-1 w-full space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="micro-mono text-[var(--accent)]">CAPABILITIES</div>
          <h1 className="h1-title text-[var(--text)]">Core System Features</h1>
          <p className="text-base text-[var(--text-muted)] leading-relaxed">
            Everything your operations team needs to run autonomous, high-volume voice outreach with human naturalness.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURE_CARDS.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="p-6 space-y-4 border-[var(--border)] bg-[var(--surface-1)]">
                <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text)]">{f.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {f.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="p-8 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface-1)] text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[var(--text)]">Start calling with VoiceForge</h2>
          <p className="text-xs text-[var(--text-muted)]">
            Join growing teams automating their phone pipelines today.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => router.push('/register')}
            >
              Get started now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
