'use client';

import { Campaign } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns.service';
import { toast } from 'sonner';
import { Play, Pause, Trash2, Users, Phone, CheckCircle } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  SCHEDULED: 'bg-purple-100 text-purple-700',
};

export function CampaignsList({ campaigns, isLoading, page, totalPages, onPageChange }: any) {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  if (isLoading) return <div className="text-center py-12" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Loading campaigns...</div>;

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Phone className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No campaigns yet</h3>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }} className="mt-1">Create a campaign to start making calls</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign: Campaign) => (
        <Card key={campaign.id} className={`p-5 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{campaign.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[campaign.status] || 'bg-gray-100'}`}>
                  {campaign.status}
                </span>
              </div>
              {campaign.description && (
                <p className="text-sm mb-3" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>{campaign.description}</p>
              )}
              <div className="flex items-center gap-5 text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {campaign.totalCustomers} customers
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {campaign.callsMade} calls made
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {campaign.callsSuccessful} successful
                </span>
              </div>
              <div className={`mt-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Goal: {campaign.goalType} | Voice: {campaign.aiVoice} | Language: {campaign.aiLanguage}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {campaign.status === 'DRAFT' || campaign.status === 'PAUSED' ? (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => startMutation.mutate(campaign.id)}
                  disabled={startMutation.isPending}
                >
                  <Play className="h-4 w-4 mr-1" />
                  {startMutation.isPending ? 'Starting...' : 'Start'}
                </Button>
              ) : campaign.status === 'ACTIVE' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => pauseMutation.mutate(campaign.id)}
                  disabled={pauseMutation.isPending}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              ) : null}

              <Button
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Delete this campaign?')) deleteMutation.mutate(campaign.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
          <span className="text-sm py-2" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
