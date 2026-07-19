import { apiClient } from '@/lib/api-client';
import { Customer, PaginatedResponse } from '@/types';

class CustomersService {
  async getCustomers(page: number = 1, limit: number = 20, search?: string): Promise<PaginatedResponse<Customer>> {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params: { page, limit, search },
    });
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  }

  async deleteAllCustomers(): Promise<void> {
    await apiClient.delete('/customers/all');
  }

  async importCustomers(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/customers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const customersService = new CustomersService();
