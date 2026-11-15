'use client';

import * as React from 'react';
import { Customer } from '@/types';
import { formatPhoneNumber } from '@/lib/utils';
import { Mail, Phone, Trash2, Users } from 'lucide-react';
import { customersService } from '@/services/customers.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CustomersListProps {
  customers: Customer[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export function CustomersList({ 
  customers, isLoading, page, totalPages, onPageChange, 
  selectedIds, onToggleSelect, onToggleSelectAll 
}: CustomersListProps) {
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersService.deleteCustomer(id);
        toast.success('Customer deleted');
        queryClient.invalidateQueries({ queryKey: ['customers'] });
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="glass rounded-[28px] p-12 text-center">
        <div className="glass-control inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Synchronizing customer directory...</span>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="glass rounded-[28px] p-12 sm:p-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mx-auto">
          <Users className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium text-[var(--text)]">No customers found</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Import contacts via CSV / Excel or add individual customers to populate your calling directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-[28px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-white/[0.08] bg-white/[0.02]">
            <tr>
              <th className="w-12 px-6 py-3.5">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer"
                  checked={customers.length > 0 && selectedIds.length === customers.length}
                  onChange={onToggleSelectAll}
                />
              </th>
              {['Contact Name', 'Phone & Email', 'Campaign Tags', 'Indexed Date', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3.5 text-[11px] font-mono font-medium text-[var(--text-subtle)] uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/20 bg-white/5 accent-white cursor-pointer"
                    checked={selectedIds.includes(customer.id)}
                    onChange={() => onToggleSelect(customer.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-sm text-[var(--text)]">
                    {customer.name}
                  </div>
                  {customer.notes && (
                    <div className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                      {customer.notes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-[var(--text)]">
                      <Phone className="w-3 h-3 text-[var(--text-subtle)]" />
                      {formatPhoneNumber(customer.phone)}
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px]">
                        <Mail className="w-3 h-3 text-[var(--text-subtle)]" />
                        {customer.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {customer.tags && customer.tags.length > 0 ? (
                      customer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.05] border border-white/10 text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-mono text-[var(--text-subtle)]">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-[var(--text-muted)]">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Recent'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="glass-control p-1.5 rounded-full text-[var(--text-subtle)] hover:text-red-400 hover:border-red-400/30 transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-white/[0.08] flex items-center justify-between">
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
