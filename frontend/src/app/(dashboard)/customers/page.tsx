'use client';

import { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { customersService } from '@/services/customers.service';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Upload, Download, Plus, Trash2, PhoneCall, Loader2 } from 'lucide-react';
import { CustomersList } from '@/components/customers/customers-list';
import { CreateCustomerDialog } from '@/components/customers/create-customer-dialog';
import { CreateCampaignDialog } from '@/components/campaigns/create-campaign-dialog';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

export default function CustomersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customers</h1>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Manage your customer database and tags
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <span className="text-sm self-center mr-2" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
              {selectedIds.length} selected
            </span>
          )}
          <Button variant="destructive" onClick={handleDeleteAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All
          </Button>
          <Button 
            variant="outline" 
            className={isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.error('Please select at least one customer for the campaign');
                return;
              }
              setIsCampaignDialogOpen(true);
            }}
          >
            <PhoneCall className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
            accept=".csv, .xlsx, .xls" 
          />
          <Button 
            variant="outline" 
            className={isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}
            onClick={() => fileInputRef.current?.click()} 
            disabled={isImporting}
          >
            {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
            Import CSV / Excel
          </Button>
          <Button 
            variant="outline" 
            className={isDark ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'}
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <CustomersList
        customers={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta.totalPages || 1}
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
