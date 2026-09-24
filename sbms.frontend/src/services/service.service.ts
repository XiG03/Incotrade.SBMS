import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/auth.types';
import { ServiceCreateRequest, ServiceUpdateRequest, ServiceResponse } from '@/types/service.types';

export const serviceService = {
  async getAll(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await apiClient.get<any, ApiResponse<ServiceResponse[]>>('/Services');
    return response;
  },

  async getActive(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await apiClient.get<any, ApiResponse<ServiceResponse[]>>('/Services/active');
    return response;
  },

  async getInactive(): Promise<ApiResponse<ServiceResponse[]>> {
    const response = await apiClient.get<any, ApiResponse<ServiceResponse[]>>('/Services/inactive');
    return response;
  },

  async create(payload: ServiceCreateRequest): Promise<ApiResponse<ServiceResponse>> {
    const response = await apiClient.post<any, ApiResponse<ServiceResponse>>('/Services', payload);
    return response;
  },

  async update(payload: ServiceUpdateRequest): Promise<ApiResponse<ServiceResponse>> {
    const response = await apiClient.put<any, ApiResponse<ServiceResponse>>('/Services', payload);
    return response;
  },
};
