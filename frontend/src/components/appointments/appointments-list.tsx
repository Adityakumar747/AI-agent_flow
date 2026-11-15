'use client';

import * as React from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { appointmentsService } from '@/services/appointments.service';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function AppointmentsList({ appointments, isLoading, page, totalPages, onPageChange }: any) {
  const queryClient = useQueryClient();

  const handleCancel = async (id: string) => {
    if (confirm('Cancel this scheduled appointment?')) {
      try {
        await appointmentsService.cancelAppointment(id);
        toast.success('Appointment cancelled');
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="glass rounded-[28px] p-12 text-center">
        <div className="glass-control inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-[var(--text-muted)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
          <span>Synchronizing calendar bookings...</span>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="glass rounded-[28px] p-12 sm:p-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white mx-auto">
          <Calendar className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium text-[var(--text)]">No appointments scheduled</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            Spoken booking agreements confirmed by the AI agent during outbound calls will appear here automatically.
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
              {['Booking Title', 'Scheduled Date', 'Slot Time', 'Customer', 'Booking Status', 'Actions'].map((header) => (
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
            {appointments.map((appointment: any) => {
              const isConfirmed = appointment.status === 'CONFIRMED';
              const isPending = appointment.status === 'PENDING';

              return (
                <tr
                  key={appointment.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-[var(--text)]">
                      {appointment.title || 'Product Consultation'}
                    </div>
                    {appointment.notes && (
                      <div className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                        {appointment.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[var(--text)]">
                    {appointment.date || 'Tomorrow'}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[var(--text-muted)]">
                    {appointment.time || '3:00 PM EST'}
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                    {appointment.customerName || appointment.customer?.name || 'Marcus Vance'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium ${
                        isConfirmed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isPending
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-white/[0.04] text-[var(--text-muted)] border border-white/10'
                      }`}
                    >
                      {isConfirmed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />}
                      {appointment.status || 'CONFIRMED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="glass-control p-1.5 rounded-full text-[var(--text-subtle)] hover:text-red-400 hover:border-red-400/30 transition-colors"
                      title="Cancel Appointment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
