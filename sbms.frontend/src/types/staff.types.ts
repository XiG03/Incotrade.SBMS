export interface StaffResponse {
  id: string;
  fullname: string;
  fullName?: string;
  email: string;
  isActive: boolean;
}

export interface CreateStaffScheduleRequest {
  staffId?: string;
  workDate: string; // Date string format YYYY-MM-DD (DateOnly)
  startTime: string; // Time string format HH:mm:ss or HH:mm (TimeOnly)
  endTime: string; // Time string format HH:mm:ss or HH:mm (TimeOnly)
}

export interface ScheduleResponse {
  id: string;
  staffId: string;
  workDate: string; // Date string format YYYY-MM-DD (DateOnly)
  startTime: string; // Time string format HH:mm:ss (TimeOnly)
  endTime: string; // Time string format HH:mm:ss (TimeOnly)
}

