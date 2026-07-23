'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  activePage?: 'home' | 'features' | 'about' | 'login';
}

export default function Navbar({ activePage }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (page: string) => {
    if (page === 'home') return pathname === '/';
    return pathname === `/${page}`;
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <nav className="relative z-20 flex items-center justify-center mt-5 px-6 py-5 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between w-full px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
        <button onClick={() => router.push('/')} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">AI</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">VoiceForge</span>
        </button>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <button onClick={() => router.push('/features')} className={isActive('features') ? 'text-white' : 'hover:text-white transition-colors'}>Features</button>
            <button onClick={() => router.push('/about')} className={isActive('about') ? 'text-white' : 'hover:text-white transition-colors'}>About</button>
            <Button
              size="default"
              className="bg-white text-black hover:bg-white/90 font-medium"
              onClick={() => router.push('/register')}
            >
              Sign up
            </Button>
            <Button
              size="default"
              className="bg-white text-black hover:bg-white/90 font-medium"
              onClick={() => router.push('/login')}
            >
              Sign in
            </Button>
          </div>
        )}

        {!isAuthPage && (
          <div className="md:hidden">
            <Button
              size="default"
              className="bg-white text-black hover:bg-white/90 font-medium"
              onClick={() => router.push('/register')}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
