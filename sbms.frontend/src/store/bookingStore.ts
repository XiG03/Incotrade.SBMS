import { create } from 'zustand';
import { ServiceResponse } from '@/types/service.types';
import { StaffResponse } from '@/types/staff.types';
import { AvailableSlotResponse } from '@/types/booking.types';

interface BookingStoreState {
  step: number;
  selectedService: ServiceResponse | null;
  selectedStaff: StaffResponse | null;
  selectedDate: string | null; // YYYY-MM-DD
  selectedSlot: AvailableSlotResponse | null;
  customerNote: string;

  setStep: (step: number) => void;
  setSelectedService: (service: ServiceResponse | null) => void;
  setSelectedStaff: (staff: StaffResponse | null) => void;
  setDateTimeSlot: (date: string, slot: AvailableSlotResponse) => void;
  setCustomerNote: (note: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStoreState>((set) => ({
  step: 1,
  selectedService: null,
  selectedStaff: null,
  selectedDate: null,
  selectedSlot: null,
  customerNote: '',

  setStep: (step: number) => set({ step }),

  setSelectedService: (service: ServiceResponse | null) =>
    set({ selectedService: service }),

  setSelectedStaff: (staff: StaffResponse | null) =>
    set({ selectedStaff: staff }),

  setDateTimeSlot: (date: string, slot: AvailableSlotResponse) =>
    set({ selectedDate: date, selectedSlot: slot }),

  setCustomerNote: (note: string) => set({ customerNote: note }),

  resetBooking: () =>
    set({
      step: 1,
      selectedService: null,
      selectedStaff: null,
      selectedDate: null,
      selectedSlot: null,
      customerNote: '',
    }),
}));
