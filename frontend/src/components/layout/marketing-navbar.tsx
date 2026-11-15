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
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none select-none">
      <div aria-hidden="true" className="site-nav-backdrop pointer-events-none absolute inset-x-0 top-0" />
      <div className="relative z-10 flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10 max-w-[1280px] mx-auto">
        {/* Brand Logo Pill */}
        <Link
          href="/"
          className="pointer-events-auto glass-control inline-flex h-11 items-center gap-2.5 rounded-full px-4 text-sm font-medium text-[var(--text)] transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <Phone className="w-3 h-3 text-white" />
          </div>
          <span className="font-medium tracking-tight">VoiceForge</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
        </Link>

        {/* Desktop Navigation Links Pill (Space Center Floating Glass) */}
        <nav className="pointer-events-auto hidden md:flex glass-control h-11 items-center gap-1 rounded-full px-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-normal text-[var(--text-muted)] hover:text-[var(--text)] px-3 py-1.5 rounded-full transition-colors hover:bg-white/[0.05]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Theme Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden sm:inline-flex text-xs font-normal text-[var(--text-muted)] hover:text-[var(--text)] px-3 py-1.5 transition-colors"
          >
            Sign in
          </Link>
          <button
            onClick={() => router.push('/register')}
            className="button-ink inline-flex h-10 items-center rounded-full px-5 text-xs font-medium"
          >
            Get started
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="glass-control p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] md:hidden inline-flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
