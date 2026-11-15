import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'VoiceForge — AI Voice Calling Agent',
  description:
    'Quiet, autonomous, AI-driven phone operations. Natural voice conversations, automated outbound campaigns, and real-time transcripts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('theme');
                var theme = stored || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text)] min-h-screen">
        <Providers>
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
