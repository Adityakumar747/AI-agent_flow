'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Galaxy from '@/components/Galaxy';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={1}
        glowIntensity={0.3}
        saturation={0}
        hueShift={140}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        repulsionStrength={2}
        autoCenterRepulsion={0}
        starSpeed={0.5}
        speed={1}
      />

      <Navbar activePage="about" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Voice Agent</h1>
          <p className="text-xl max-w-2xl mx-auto text-white/60">
            Empowering businesses with intelligent voice calling solutions powered by artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-white/10">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Smart Campaigns</h3>
            <p className="text-white/60">
              Create and manage AI-powered calling campaigns with intelligent routing and scheduling.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-white/10">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Real-time Analytics</h3>
            <p className="text-white/60">
              Monitor call performance, customer sentiment, and conversion metrics in real-time.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-white/10">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Enterprise Security</h3>
            <p className="text-white/60">
              Bank-grade security with end-to-end encryption and compliance-ready infrastructure.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90"
            onClick={() => router.push('/login')}
          >
            Get started
          </Button>
        </div>
      </main>
    </div>
  );
}