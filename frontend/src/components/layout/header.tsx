'use client';

import * as React from 'react';
import { Bell, User, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useWebSocket } from '@/hooks/use-websocket';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { isConnected } = useWebSocket();
  const [showLogout, setShowLogout] = React.useState(false);
  const logoutRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-md px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.05] transition-colors"
          >
            {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        )}
        <h2 className="text-sm font-medium text-[var(--text)]">
          Welcome, <span className="font-semibold">{user?.name || 'Operator'}</span>
        </h2>
        {isConnected && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[11px] font-mono text-orange-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
            LIVE TELEMETRY
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="glass-control inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[var(--text)]">
          <User className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          <span className="font-medium">{user?.name || user?.email || 'User'}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[var(--text-subtle)]">
            {user?.role || 'ADMIN'}
          </span>
        </div>

        <div className="relative" ref={logoutRef}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className="glass-control p-2 rounded-full text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-colors"
            title="Account Options"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>

          {showLogout && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl glass p-2 shadow-2xl z-50 animate-fade-in space-y-1">
              <div className="px-3 py-2 border-b border-white/10 text-xs">
                <div className="font-medium text-[var(--text)]">{user?.name}</div>
                <div className="text-[11px] text-[var(--text-subtle)] truncate">{user?.email}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
