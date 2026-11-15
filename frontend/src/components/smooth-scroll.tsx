'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

const ENABLED_PREFIXES = ['/', '/about', '/features', '/design'];
const DISABLED_PREFIXES = [
  '/dashboard',
  '/campaigns',
  '/calls',
  '/customers',
  '/appointments',
  '/analytics',
  '/settings',
  '/login',
  '/register',
  '/callback',
];

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const disabled =
    reduced ||
    DISABLED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    !ENABLED_PREFIXES.some((p) => pathname === p || (p !== '/' && pathname.startsWith(p)));

  if (disabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: true }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}

