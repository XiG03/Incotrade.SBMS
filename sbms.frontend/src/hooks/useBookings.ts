import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';
import { BookingFilterRequest, BookingCreateRequest } from '@/types/booking.types';

export function useMyBookings(filter?: BookingFilterRequest) {
  return useQuery({
    queryKey: ['my-bookings', filter],
    queryFn: () => bookingService.getMyBookings(filter),
  });
}

export function useAvailableSlots(filter: BookingFilterRequest, enabled: boolean = true) {
  return useQuery({
    queryKey: ['available-slots', filter],
    queryFn: () => bookingService.getAvailableSlots(filter),
    enabled: enabled && !!filter.fromDate,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingCreateRequest) =>
      bookingService.createBooking(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['available-slots'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingService.cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    },
  });
}

export function useAllBookings(filter?: BookingFilterRequest) {
  return useQuery({
    queryKey: ['admin-bookings', filter],
    queryFn: () => bookingService.getAllBookings(filter),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}

