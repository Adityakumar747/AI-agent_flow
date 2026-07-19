import { apiClient } from '@/lib/api-client';
import { Campaign, PaginatedResponse } from '@/types';

class CampaignsService {
  async getCampaigns(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Campaign>> {
    const response = await apiClient.get<PaginatedResponse<Campaign>>('/campaigns', {
      params: { page, limit },
    });
    return response.data;
  }

  async getCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  }

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.post<Campaign>('/campaigns', data);
    return response.data;
  }

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const response = await apiClient.patch<Campaign>(`/campaigns/${id}`, data);
    return response.data;
  }

  async deleteCampaign(id: string): Promise<void> {
    await apiClient.delete(`/campaigns/${id}`);
  }

  async startCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/campaigns/${id}/start`);
    return response.data;
  }

  async pauseCampaign(id: string): Promise<Campaign> {
    const response = await apiClient.post<Campaign>(`/campaigns/${id}/pause`);
    return response.data;
  }

  async addCustomersToCampaign(id: string, customerIds: string[]): Promise<void> {
    await apiClient.post(`/campaigns/${id}/customers`, { customerIds });
  }
}

export const campaignsService = new CampaignsService();
