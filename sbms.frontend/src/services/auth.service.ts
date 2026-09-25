import { apiClient } from '@/lib/axios';
import { LoginRequest, LoginResponseData, ApiResponse } from '@/types/auth.types';

export const authService = {
  async login(payload: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    const response = await apiClient.post<any, ApiResponse<LoginResponseData>>('/Auth/login', payload);
    return response;
  },
};
