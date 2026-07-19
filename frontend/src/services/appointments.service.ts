import { apiClient } from '@/lib/api-client';
import { Appointment, PaginatedResponse } from '@/types';

class AppointmentsService {
  async getAppointments(
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<PaginatedResponse<Appointment>> {
    const response = await apiClient.get<PaginatedResponse<Appointment>>('/appointments', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(`/appointments/${id}/cancel`, { reason });
    return response.data;
  }

  async sendConfirmation(id: string): Promise<void> {
    await apiClient.post(`/appointments/${id}/send-confirmation`);
  }

  async getStatistics(): Promise<any> {
    const response = await apiClient.get('/appointments/statistics');
    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();
