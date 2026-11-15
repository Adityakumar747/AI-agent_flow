'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MarketingNavbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Use cases', href: '/#use-cases' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full h-16 transition-all duration-200 select-none border-b',
        isScrolled
          ? 'bg-[var(--bg)]/85 backdrop-blur-md border-[var(--border)] shadow-[var(--shadow-sm)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
            <Phone className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-base tracking-tight text-[var(--text)]">
              VoiceForge
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-live-pulse" />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-normal text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA / Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/login')}
          >
            Log in
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={() => router.push('/register')}
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-[var(--r-md)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] border border-[var(--border)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--surface-1)] px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[var(--text)] py-1.5 hover:text-[var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/login');
              }}
            >
              Log in
            </Button>
            <Button
              variant="accent"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/register');
              }}
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

