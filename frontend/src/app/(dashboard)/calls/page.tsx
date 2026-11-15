'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { callsService } from '@/services/calls.service';
import { CallsList } from '@/components/calls/calls-list';
import { CallFilters } from '@/components/calls/call-filters';

export default function CallsPage() {
  const [page, setPage] = React.useState(1);
  const [filters, setFilters] = React.useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['calls', page, filters],
    queryFn: () => callsService.getCalls(page, 20, filters),
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="glass-control inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Telephony Carrier Stream</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
          Voice Call Records
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Search and inspect real-time audio sessions, durations, and booking outcomes.
        </p>
      </div>

      <CallFilters filters={filters} onFiltersChange={setFilters} />

      <CallsList
        calls={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta?.totalPages || 1}
      />
    </div>
  );
}
