'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/lib/store/auth-store';
import { Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data.email, data.password, data.name);
      setUser(response.user);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between p-5 selection:bg-white selection:text-black">
      {/* Top Bar with Space-Style Floating Home Link */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between pt-2">
        <Link
          href="/"
          className="glass-control inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-medium text-[var(--text)] hover:scale-[1.02] transition-transform"
        >
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
            <Phone className="w-2.5 h-2.5 text-white" />
          </div>
          <span>VoiceForge</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
        </Link>
        <Link
          href="/login"
          className="text-xs text-[var(--text-muted)] hover:text-white transition-colors"
        >
          Already have an account? <span className="text-white underline">Sign in</span>
        </Link>
      </div>

      {/* Centered Space-Style Card */}
      <div className="w-full max-w-[420px] mx-auto my-auto">
        <div className="glass rounded-[28px] p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-11 h-11 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white mx-auto mb-3">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-[var(--text)]">Create Account</h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              START YOUR 14-DAY AUTONOMOUS CALLING TRIAL
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs text-[var(--text-muted)] font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Marcus Vance"
                {...register('name')}
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-white/30 transition-colors"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs text-[var(--text-muted)] font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="marcus@company.com"
                {...register('email')}
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-white/30 transition-colors"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs text-[var(--text-muted)] font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-ink w-full h-11 rounded-full text-xs font-medium mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-[11px] text-[var(--text-subtle)] text-center leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy. Includes 500 free minutes.
          </p>
        </div>
      </div>

      {/* Subtle Footer Note */}
      <div className="text-center text-xs text-[var(--text-subtle)] py-4 font-mono">
        CARRIER TELEPHONY BACKBONE · VOICEFORGE AI 2026
      </div>
    </div>
  );
}
