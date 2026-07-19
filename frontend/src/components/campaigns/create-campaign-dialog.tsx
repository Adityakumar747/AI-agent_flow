'use client';

import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { campaignsService } from '@/services/campaigns.service';
import { customersService } from '@/services/customers.service';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  selectedCustomerIds?: string[];
}

export function CreateCampaignDialog({ open, onClose, selectedCustomerIds = [] }: CreateCampaignDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [aiScript, setAiScript] = useState('');
  const [goalType, setGoalType] = useState('APPOINTMENT');
  const [dialogSelectedCustomers, setDialogSelectedCustomers] = useState<string[]>([]);

  const { data: customersData } = useQuery({
    queryKey: ['customers', 1], // just fetch first page of customers for now
    queryFn: () => customersService.getCustomers(1, 100),
    enabled: open && selectedCustomerIds.length === 0,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => campaignsService.createCampaign(data),
    onSuccess: () => {
      toast.success('Campaign created successfully!');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create campaign');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiScript.length < 50) {
      toast.error('AI Script must be at least 50 characters long.');
      return;
    }
    createMutation.mutate({
      name,
      aiScript,
      goalType,
      customerIds: selectedCustomerIds.length > 0 ? selectedCustomerIds : dialogSelectedCustomers,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 my-8">
        <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
        {selectedCustomerIds.length > 0 ? (
          <div className="mb-4 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            You are creating a campaign for {selectedCustomerIds.length} selected customer(s).
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Customers (Hold Ctrl/Cmd to select multiple)</label>
            <select
              multiple
              className="w-full border rounded-md p-2 h-32"
              value={dialogSelectedCustomers}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions);
                setDialogSelectedCustomers(options.map(o => o.value));
              }}
            >
              {customersData?.data?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Campaign Name</label>
            <input
              type="text"
              required
              className="w-full border rounded-md p-2"
              placeholder="e.g., Bike Service Reminder"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Goal Type</label>
            <select
              className="w-full border rounded-md p-2"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
            >
              <option value="APPOINTMENT">Book Appointment</option>
              <option value="SURVEY">Customer Survey</option>
              <option value="REMINDER">General Reminder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">AI Agent Script</label>
            <p className="text-xs text-muted-foreground mb-2">
              Write exactly what you want the AI to say. Be clear about the goal. (Min 50 characters)
            </p>
            <textarea
              required
              rows={6}
              className="w-full border rounded-md p-2"
              placeholder="Hello! I am calling from Super Bikes. I noticed your vehicle is due for a service..."
              value={aiScript}
              onChange={(e) => setAiScript(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
