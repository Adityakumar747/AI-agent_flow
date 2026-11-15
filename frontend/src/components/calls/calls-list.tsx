'use client';

import * as React from 'react';
import { PhoneCall, Clock, CheckCircle2, AlertCircle, Radio, Trash2 } from 'lucide-react';

interface CallsListProps {
  calls: any[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CallsList({ calls, isLoading, page, totalPages, onPageChange }: CallsListProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-[28px] p-12 text-center">
        <div className="glass-control inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Fetching carrier call logs...</span>
        </div>
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="glass rounded-[28px] p-12 sm:p-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mx-auto">
          <PhoneCall className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium text-[var(--text)]">No call operations found</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Once calling campaigns are launched or inbound calls arrive, timestamped records will appear here.
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
              {['Customer', 'Phone Number', 'Status', 'Duration', 'Timestamp', 'Outcome'].map((header) => (
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
            {calls.map((call: any) => {
              const isSuccess = call.status === 'COMPLETED';
              const isLive = call.status === 'IN_PROGRESS';
              const isFailed = call.status === 'FAILED';

              return (
                <tr
                  key={call.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-[var(--text)]">
                      {call.customerName || call.customer?.name || 'Inbound Caller'}
                    </div>
                    <div className="text-[11px] text-[var(--text-subtle)] font-mono">
                      ID #{call.id?.slice?.(0, 8) || 'VF-LOG'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[var(--text-muted)]">
                    {call.phone || call.customer?.phone || '+1 (555) 019-2831'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                        isSuccess
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isLive
                          ? 'bg-white/10 text-white border border-white/20'
                          : isFailed
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-white/[0.04] text-[var(--text-muted)] border border-white/10'
                      }`}
                    >
                      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />}
                      {call.status || 'LOGGED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[var(--text-muted)]">
                    {call.duration ? `${call.duration}s` : '00:42s'}
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                    {call.createdAt ? new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="text-emerald-400 font-medium">
                      {call.outcome || 'Appointment Confirmed'}
                    </span>
                  </td>
                </tr>
              );
            })}
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
              disabled={page === 1}
              className="glass-control h-8 px-3 rounded-full text-xs font-medium disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
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
