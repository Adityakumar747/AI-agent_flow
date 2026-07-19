import { apiClient } from '@/lib/api-client';
import { KnowledgeBase, PaginatedResponse } from '@/types';

class KnowledgeBaseService {
  async getEntries(
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<PaginatedResponse<KnowledgeBase>> {
    const response = await apiClient.get<PaginatedResponse<KnowledgeBase>>('/knowledge-base', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }

  async getEntry(id: string): Promise<KnowledgeBase> {
    const response = await apiClient.get<KnowledgeBase>(`/knowledge-base/${id}`);
    return response.data;
  }

  async createEntry(data: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
    const response = await apiClient.post<KnowledgeBase>('/knowledge-base', data);
    return response.data;
  }

  async updateEntry(id: string, data: Partial<KnowledgeBase>): Promise<KnowledgeBase> {
    const response = await apiClient.patch<KnowledgeBase>(`/knowledge-base/${id}`, data);
    return response.data;
  }

  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`/knowledge-base/${id}`);
  }

  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/knowledge-base/categories');
    return response.data;
  }

  async bulkImport(entries: Partial<KnowledgeBase>[]): Promise<{ imported: number; errors: string[] }> {
    const response = await apiClient.post('/knowledge-base/bulk-import', entries);
    return response.data;
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
