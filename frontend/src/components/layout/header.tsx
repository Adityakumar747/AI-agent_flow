'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, User, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { Badge } from '@/components/ui/badge';
import { useWebSocket } from '@/hooks/use-websocket';
import { useTheme } from '@/components/theme-provider';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { isConnected } = useWebSocket();
  const { theme, toggleTheme } = useTheme();
  const [showLogout, setShowLogout] = useState(false);
  const logoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
        setShowLogout(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`h-16 border-b px-6 flex items-center justify-between ${
      theme === 'dark'
        ? 'border-white/10 bg-black'
        : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user?.name || 'User'}
        </h2>
        {isConnected && (
          <Badge variant="success" className={`text-xs ${theme === 'light' ? '!text-black' : ''}`}>
            ● Live
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <User className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {user?.name || user?.email || 'User'}
          </span>
          <Badge variant="outline" className="text-xs">
            {user?.role}
          </Badge>
        </button>

        <div className="relative" ref={logoutRef}>
          <button
            onClick={() => setShowLogout(!showLogout)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <LogOut className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Logout
            </span>
          </button>

          {showLogout && (
            <div className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border z-50 ${
              theme === 'dark'
                ? 'bg-gray-900 border-white/10'
                : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => setShowLogout(false)}
                className={`w-full text-left px-4 py-2 text-sm rounded-t-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogout(false);
                  logout();
                }}
                className={`w-full text-left px-4 py-2 text-sm rounded-b-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-red-400 hover:bg-white/5'
                    : 'text-red-600 hover:bg-gray-50'
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}