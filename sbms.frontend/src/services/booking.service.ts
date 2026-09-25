import { apiClient } from '@/lib/axios';
import {
  ApiResponse,
  PagedResponse,
  BookingResponse,
  BookingFilterRequest,
  BookingCancelRequest,
  BookingCreateRequest,
  AvailableSlotResponse,
} from '@/types/booking.types';

export const bookingService = {
  // GET /api/Bookings/my-bookings
  getMyBookings: async (
    filter?: BookingFilterRequest
  ): Promise<ApiResponse<PagedResponse<BookingResponse[]>>> => {
    const response = await apiClient.get<
      any,
      ApiResponse<PagedResponse<BookingResponse[]>>
    >('/Bookings/my-bookings', {
      params: filter,
    });
    return response;
  },

  // POST /api/Bookings/{id}/cancel
  cancelBooking: async (
    id: string,
    cancellationReason?: string
  ): Promise<ApiResponse<any>> => {
    const payload: BookingCancelRequest = {
      bookingId: id,
      cancellationReason,
    };
    const response = await apiClient.post<any, ApiResponse<any>>(
      `/Bookings/${id}/cancel`,
      payload
    );
    return response;
  },

  // GET /api/Bookings/available-slots
  getAvailableSlots: async (
    filter: BookingFilterRequest
  ): Promise<ApiResponse<PagedResponse<AvailableSlotResponse[]>>> => {
    try {
      const response = await apiClient.get<
        any,
        ApiResponse<PagedResponse<AvailableSlotResponse[]>>
      >('/Bookings/available-slots', {
        params: filter,
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.data?.statusCode === 404) {
        return (
          error.response?.data || {
            statusCode: 404,
            message: 'Available slot not found',
            data: {
              fromDate: filter.fromDate,
              toDate: filter.toDate,
              totalItems: 0,
              data: [],
            },
          }
        );
      }
      throw error;
    }
  },

  // POST /api/Bookings
  createBooking: async (
    request: BookingCreateRequest
  ): Promise<ApiResponse<BookingResponse>> => {
    const response = await apiClient.post<any, ApiResponse<BookingResponse>>(
      '/Bookings',
      request
    );
    return response;
  },

  // GET /api/Bookings (Admin)
  getAllBookings: async (
    filter?: BookingFilterRequest
  ): Promise<ApiResponse<PagedResponse<BookingResponse[]>>> => {
    const response = await apiClient.get<
      any,
      ApiResponse<PagedResponse<BookingResponse[]>>
    >('/Bookings', {
      params: filter,
    });
    return response;
  },

  // PATCH /api/Bookings/{id}/status (Admin)
  updateStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch<any, ApiResponse<any>>(
      `/Bookings/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return response;
  },
};
