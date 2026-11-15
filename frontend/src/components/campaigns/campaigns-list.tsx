'use client';

import * as React from 'react';
import { Campaign } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns.service';
import { toast } from 'sonner';
import { Play, Pause, Trash2, Users, Phone, CheckCircle2, Megaphone } from 'lucide-react';

export function CampaignsList({ campaigns, isLoading, page, totalPages, onPageChange }: any) {
  const queryClient = useQueryClient();

  const startMutation = useMutation({
    mutationFn: (id: string) => campaignsService.startCampaign(id),
    onSuccess: () => {
      toast.success('Campaign started! Calls are being placed...');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || 'Failed to start campaign';
      toast.error(`Error: ${msg}`);
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: string) => campaignsService.pauseCampaign(id),
    onSuccess: () => {
      toast.success('Campaign paused');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: () => toast.error('Failed to pause campaign'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => campaignsService.deleteCampaign(id),
    onSuccess: () => {
      toast.success('Campaign deleted');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: () => toast.error('Failed to delete campaign'),
  });

  if (isLoading) {
    return (
      <div className="glass rounded-[28px] p-12 text-center">
        <div className="glass-control inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
          <span>Loading campaigns...</span>
        </div>
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="glass rounded-[28px] p-12 sm:p-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mx-auto">
          <Megaphone className="w-5 h-5 text-orange-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium text-[var(--text)]">No active campaigns</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Create an outbound voice campaign with prompt scripts and contact lists to start dialing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign: Campaign) => {
        const isActive = campaign.status === 'ACTIVE';
        const isDraft = campaign.status === 'DRAFT';
        const isPaused = campaign.status === 'PAUSED';

        return (
          <div
            key={campaign.id}
            className="glass rounded-[28px] p-6 sm:p-7 space-y-4 hover:border-white/20 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-[var(--text)] tracking-tight">
                    {campaign.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : isPaused
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-white/[0.04] text-[var(--text-muted)] border border-white/10'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />}
                    {campaign.status}
                  </span>
                </div>

                {campaign.description && (
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {campaign.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-1">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                    {campaign.totalCustomers || 0} Contacts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                    {campaign.callsMade || 0} Dialed
                  </span>
                  <span className="flex items-center gap-1.5 text-orange-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {campaign.callsSuccessful || 0} Booked
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[var(--text-subtle)] pt-1">
                  GOAL: {campaign.goalType} · VOICE: {campaign.aiVoice || 'Standard'} · LANG: {campaign.aiLanguage || 'en-US'}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-start">
                {isDraft || isPaused ? (
                  <button
                    onClick={() => startMutation.mutate(campaign.id)}
                    disabled={startMutation.isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-medium text-orange-400 hover:bg-orange-500/20 transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {startMutation.isPending ? 'Starting...' : 'Start'}
                  </button>
                ) : isActive ? (
                  <button
                    onClick={() => pauseMutation.mutate(campaign.id)}
                    disabled={pauseMutation.isPending}
                    className="glass-control inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-amber-400 hover:border-amber-400/30 transition-colors disabled:opacity-50"
                  >
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    Pause
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    if (confirm('Delete this campaign?')) deleteMutation.mutate(campaign.id);
                  }}
                  className="glass-control p-2 rounded-full text-[var(--text-subtle)] hover:text-red-400 hover:border-red-400/30 transition-colors"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-4">
          <span className="text-xs font-mono text-[var(--text-subtle)]">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="glass-control h-8 px-3 rounded-full text-xs font-medium disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="glass-control h-8 px-3 rounded-full text-xs font-medium disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
