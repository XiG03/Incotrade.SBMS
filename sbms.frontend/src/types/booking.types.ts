export interface ApiResponse<T> {
  statusCode: number;
  message?: string;
  data?: T;
}

export interface PagedResponse<T> {
  fromDate?: string | null;
  toDate?: string | null;
  totalItems: number;
  data: T | null;
}

export interface BookingFilterRequest {
  fromDate?: string;
  toDate?: string;
  status?: string;
}

export interface BookingResponse {
  id: string;
  bookingCode: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm:ss
  endTime: string;     // HH:mm:ss
  customerNote?: string;
  cancellationReason?: string;
  createdAt: string;
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | string;
}

export interface BookingCancelRequest {
  bookingId?: string;
  customerId?: string;
  CancellationReason?: string; // PascalCase matching backend DTO
}


export interface BookingCreateRequest {
  bookingCode?: string;
  customerId?: string;
  serviceId: string;
  staffId: string;
  bookingDate: string;
  startTime: string;
  durationMinutes: number;
  status?: string;
  customerNote?: string;
}

export interface AvailableSlotResponse {
  staffId: string;
  staffName: string;
  date: string;
  startTime: string;
  endTime: string;
}
