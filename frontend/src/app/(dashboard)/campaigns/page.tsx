'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns.service';
import { Plus } from 'lucide-react';
import { CampaignsList } from '@/components/campaigns/campaigns-list';
import { CreateCampaignDialog } from '@/components/campaigns/create-campaign-dialog';

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['campaigns', page],
    queryFn: () => campaignsService.getCampaigns(page, 20),
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="glass-control inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span>Autonomous Outbound Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
            Calling Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Create and monitor targeted AI phone campaigns, prompts, and dialer queues.
          </p>
        </div>

        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="button-ink inline-flex h-10 items-center justify-center rounded-full px-5 text-xs font-medium gap-2 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          New Campaign
        </button>
      </div>

      <CampaignsList
        campaigns={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta?.totalPages || 1}
      />

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
