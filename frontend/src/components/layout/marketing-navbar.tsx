'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function MarketingNavbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Use cases', href: '/#use-cases' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none select-none">
      <div className="pointer-events-auto w-full max-w-5xl h-14 px-3 sm:px-5 flex items-center justify-between rounded-full bg-[var(--surface-1)]/80 border border-[var(--border)] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-200">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 pl-1 group">
          <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-white group-hover:border-white/30 transition-colors">
            <Phone className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-sm tracking-tight text-[var(--text)]">
              VoiceForge
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-normal text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => router.push('/login')}
            className="text-xs font-normal text-[var(--text-muted)] hover:text-[var(--text)] px-3 py-1.5 transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push('/register')}
            className="inline-flex h-9 items-center rounded-full px-4 text-xs font-medium bg-[var(--text)] text-[var(--bg)] hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            Get started
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto fixed top-20 inset-x-4 max-w-md mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-5 space-y-4 shadow-2xl backdrop-blur-2xl animate-fade-in md:hidden">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--text)] py-2 border-b border-[var(--border)]/40 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/login');
              }}
              className="w-full py-2.5 rounded-full border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/register');
              }}
              className="w-full py-2.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium hover:opacity-90"
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
