'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const error = params.get('error');

      if (error) {
        toast.error(error);
        router.push('/login');
        return;
      }

      if (!token) {
        toast.error('No token received');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const user = await response.json();
        setUser({ ...user, token });
        toast.success('Login successful!');
        router.push('/dashboard');
      } catch (error) {
        toast.error('OAuth login failed');
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, setUser]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4746ef] border-t-transparent" />
        </div>
      </div>
      <div className="relative z-10 text-white">Authenticating...</div>
    </div>
  );
}
