'use client';

import * as React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface CallFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function CallFilters({ filters, onFiltersChange }: CallFiltersProps) {
  const [searchTerm, setSearchTerm] = React.useState(filters?.search || '');
  const [status, setStatus] = React.useState(filters?.status || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchTerm, status });
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatus('');
    onFiltersChange({});
  };

  return (
    <div className="glass rounded-[24px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name or phone..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onFiltersChange({ ...filters, status: e.target.value, search: searchTerm });
          }}
          className="h-10 px-4 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[var(--text)] focus:outline-none focus:border-white/30"
        >
          <option value="" className="bg-[#111113] text-white">All Statuses</option>
          <option value="COMPLETED" className="bg-[#111113] text-white">Completed</option>
          <option value="IN_PROGRESS" className="bg-[#111113] text-white">In Progress</option>
          <option value="FAILED" className="bg-[#111113] text-white">Failed</option>
        </select>

        <button
          type="submit"
          className="button-ink h-10 rounded-full px-5 text-xs font-medium"
        >
          Filter
        </button>
      </form>

      {(searchTerm || status) && (
        <button
          type="button"
          onClick={handleReset}
          className="glass-control h-10 px-4 rounded-full text-xs font-mono text-[var(--text-muted)] hover:text-white flex items-center gap-1.5"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>
  );
}
