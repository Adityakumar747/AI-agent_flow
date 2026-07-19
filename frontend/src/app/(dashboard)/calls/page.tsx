'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { callsService } from '@/services/calls.service';
import { CallsList } from '@/components/calls/calls-list';
import { CallFilters } from '@/components/calls/call-filters';
import { useTheme } from '@/components/theme-provider';

export default function CallsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, isLoading } = useQuery({
    queryKey: ['calls', page, filters],
    queryFn: () => callsService.getCalls(page, 20, filters),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Calls</h1>
        <p style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
          View and manage all calling activity
        </p>
      </div>

      <CallFilters filters={filters} onFiltersChange={setFilters} />

      <CallsList
        calls={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta.totalPages || 1}
      />
    </div>
  );
}
