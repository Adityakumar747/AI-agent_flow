import { apiClient } from '@/lib/api-client';
import { Call, PaginatedResponse } from '@/types';

class CallsService {
  async getCalls(
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<PaginatedResponse<Call>> {
    const response = await apiClient.get<PaginatedResponse<Call>>('/calls', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  async getCall(id: string): Promise<Call> {
    const response = await apiClient.get<Call>(`/calls/${id}`);
    return response.data;
  }

  async makeCall(customerId: string, campaignId: string): Promise<Call> {
    const response = await apiClient.post<Call>('/calls/make-call', {
      customerId,
      campaignId,
    });
    return response.data;
  }
}

export const callsService = new CallsService();
