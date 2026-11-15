'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useAuthStore } from '@/lib/store/auth-store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-200 selection:bg-white selection:text-black">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[var(--bg)]">
          {children}
        </main>
      </div>
    </div>
  );
}
