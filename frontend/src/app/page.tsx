'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Galaxy from '@/components/Galaxy';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
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

      <Navbar activePage="home" />

      <main className="relative z-10 flex-1 flex items-center justify-center text-center px-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 mb-6">
            <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-medium">NEW</span>
            <span>V1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Your AI Employee<br />Never Misses a Call
          </h1>

          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Automate outbound calls, answer customer inquiries, schedule appointments, and provide 24/7 support with natural AI conversations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-medium"
              onClick={() => router.push('/login')}
            >
              Get started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => router.push('/about')}
            >
              Learn more
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}