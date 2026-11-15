'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { customersService } from '@/services/customers.service';
import { apiClient } from '@/lib/api-client';
import { Upload, Download, Plus, Trash2, PhoneCall, Loader2 } from 'lucide-react';
import { CustomersList } from '@/components/customers/customers-list';
import { CreateCustomerDialog } from '@/components/customers/create-customer-dialog';
import { CreateCampaignDialog } from '@/components/campaigns/create-campaign-dialog';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page],
    queryFn: () => customersService.getCustomers(page, 20),
  });

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      const result = await customersService.importCustomers(file);
      toast.success(`Imported ${result.imported} customers successfully!`);
      if (result.errors && result.errors.length > 0) {
        toast.warning(`${result.errors[0]}`);
      }
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to import customers');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/customers/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export customers');
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('Are you sure you want to delete ALL customers? This cannot be undone.')) {
      try {
        await customersService.deleteAllCustomers();
        toast.success('All customers deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } catch (error) {
        toast.error('Failed to delete customers');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="glass-control inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span>Customer Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
            Contacts & Audiences
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Manage target phone numbers, notes, and audience segments for campaign dialing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {selectedIds.length > 0 && (
            <span className="text-xs font-mono text-emerald-400 mr-2">
              ● {selectedIds.length} SELECTED
            </span>
          )}

          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.error('Please select at least one customer for the campaign');
                return;
              }
              setIsCampaignDialogOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Launch With Selected
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".csv, .xlsx, .xls" 
          />
          <button
            onClick={() => fileInputRef.current?.click()} 
            disabled={isImporting}
            className="glass-control h-9 px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5 text-[var(--text)]"
          >
            {isImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            Import CSV
          </button>

          <button
            onClick={handleExport}
            className="glass-control h-9 px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5 text-[var(--text)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="button-ink h-9 px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Contact
          </button>

          <button
            onClick={handleDeleteAll}
            className="glass-control h-9 px-3 rounded-full text-xs font-medium text-red-400 hover:border-red-400/30 transition-colors"
            title="Delete All Contacts"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <CustomersList
        customers={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta?.totalPages || 1}
        selectedIds={selectedIds}
        onToggleSelect={(id) => {
          setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
          );
        }}
        onToggleSelectAll={() => {
          const pageIds = (data?.data || []).map((c: any) => c.id);
          if (selectedIds.length === pageIds.length) {
            setSelectedIds([]);
          } else {
            setSelectedIds(pageIds);
          }
        }}
      />

      <CreateCustomerDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {isCampaignDialogOpen && (
        <CreateCampaignDialog
          open={isCampaignDialogOpen}
          onClose={() => setIsCampaignDialogOpen(false)}
          selectedCustomerIds={selectedIds}
        />
      )}
    </div>
  );
}
