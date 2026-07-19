'use client';

import { Bell, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { Badge } from '@/components/ui/badge';
import { useWebSocket } from '@/hooks/use-websocket';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { isConnected } = useWebSocket();

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome back, {user?.name || 'User'}
        </h2>
        {isConnected && (
          <Badge variant="success" className="text-xs">
            ● Live
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">{user?.email}</span>
          <Badge variant="outline" className="text-xs">
            {user?.role}
          </Badge>
        </div>

        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
