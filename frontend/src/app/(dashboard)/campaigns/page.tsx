'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns.service';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CampaignsList } from '@/components/campaigns/campaigns-list';
import { CreateCampaignDialog } from '@/components/campaigns/create-campaign-dialog';

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['campaigns', page],
    queryFn: () => campaignsService.getCampaigns(page, 20),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your calling campaigns and track performance
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <CampaignsList
        campaigns={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta.totalPages || 1}
      />

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
