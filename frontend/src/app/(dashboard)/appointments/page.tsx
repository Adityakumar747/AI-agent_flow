'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentsService } from '@/services/appointments.service';
import { apiClient } from '@/lib/api-client';
import { Plus, Download } from 'lucide-react';
import { AppointmentsList } from '@/components/appointments/appointments-list';
import { CreateAppointmentDialog } from '@/components/appointments/create-appointment-dialog';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', page],
    queryFn: () => appointmentsService.getAppointments(page, 20),
  });

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/appointments/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'appointments_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to export appointments');
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="glass-control inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-[var(--text-muted)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-live-pulse" />
            <span>Calendar Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text)]">
            Confirmed Appointments
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Calendar slots secured by AI agents during voice conversations with SMS confirmations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="glass-control h-9 px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5 text-[var(--text)]"
          >
            <Download className="w-3.5 h-3.5" />
            Export Excel
          </button>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="button-ink h-9 px-4 rounded-full text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            New Appointment
          </button>
        </div>
      </div>

      <AppointmentsList
        appointments={data?.data || []}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        totalPages={data?.meta?.totalPages || 1}
      />

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}
