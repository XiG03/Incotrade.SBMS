import { apiClient } from '@/lib/axios';
import { ApiResponse } from '@/types/auth.types';
import { StaffResponse, ScheduleResponse, CreateStaffScheduleRequest } from '@/types/staff.types';

export const staffService = {
  // Get all staff members
  async getAllStaff(): Promise<ApiResponse<StaffResponse[]>> {
    const response = await apiClient.get<any, ApiResponse<StaffResponse[]>>('/Staff');
    return response;
  },

  // Get work schedules for a specific staff member
  async getStaffSchedules(staffId: string): Promise<ApiResponse<ScheduleResponse[]>> {
    const response = await apiClient.get<any, ApiResponse<ScheduleResponse[]>>(`/staffs/${staffId}/schedules`);
    return response;
  },

  // Create a new work schedule for a staff member
  async createStaffSchedule(
    staffId: string,
    payload: CreateStaffScheduleRequest
  ): Promise<ApiResponse<ScheduleResponse>> {
    const response = await apiClient.post<any, ApiResponse<ScheduleResponse>>(
      `/staffs/${staffId}/schedules`,
      payload
    );
    return response;
  },
};
