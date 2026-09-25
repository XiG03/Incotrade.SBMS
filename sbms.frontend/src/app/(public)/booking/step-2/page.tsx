'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAvailableSlots } from '@/hooks/useBookings';
import { useBookingStore } from '@/store/bookingStore';

export default function BookingStep2Page() {
  const router = useRouter();
  const {
    selectedService,
    selectedStaff,
    selectedDate,
    selectedSlot,
    setDateTimeSlot,
    setStep,
  } = useBookingStore();

  const today = new Date().toISOString().split('T')[0];
  const [dateInput, setDateInput] = useState<string>(selectedDate || today);

  // Fetch available slots from backend API
  const { data: slotsRes, isLoading: loadingSlots, isError } = useAvailableSlots({
    fromDate: dateInput,
    toDate: dateInput,
    status: undefined,
  });

  // Check if Backend returned 404 NotFound
  const isNotFound = slotsRes?.statusCode === 404 || isError;

  // Extract slots array from API PagedResponse wrapper
  const pagedData = slotsRes?.data;
  const rawSlots: any[] = Array.isArray(pagedData?.data)
    ? pagedData.data
    : Array.isArray(pagedData)
    ? pagedData
    : [];

  const handleSelectSlot = (slot: any) => {
    setDateTimeSlot(dateInput, slot);
  };

  const handleNext = () => {
    if (!selectedSlot) return;
    setStep(3);
    router.push('/booking/confirmation');
  };

  const handleSelectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDateInput(tomorrow.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full py-space-lg px-gutter-sm lg:px-gutter max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Stepper Progress */}
      <div className="p-space-md lg:p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="grid grid-cols-3 gap-space-md">
          {/* Step 1 (Completed) */}
          <div
            onClick={() => router.push('/booking/step-1')}
            className="flex items-center gap-space-sm cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-tertiary uppercase">Bước 1</span>
              <span className="font-label-md text-label-md text-on-surface truncate block">
                {selectedService?.name || 'Chọn Dịch vụ'}
              </span>
            </div>
          </div>
          {/* Step 2 (Active) */}
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Bước 2</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate block">
                Chọn Ngày & Giờ
              </span>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex items-center gap-space-sm opacity-50">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              3
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Bước 3</span>
              <span className="font-label-md text-label-md text-on-surface truncate block">Xác nhận</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-space-md">
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
          Bước 2: Chọn Ngày & Khung giờ còn trống
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Dịch vụ đã chọn: <strong className="text-on-surface">{selectedService?.name || 'Chưa chọn'}</strong>
          {selectedStaff && (
            <span>
              {' '}
              | Chuyên viên:{' '}
              <strong className="text-primary">
                {selectedStaff.fullName || selectedStaff.fullname}
              </strong>
            </span>
          )}
        </p>
      </div>

      {/* Date Selector & Available Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Date Selector (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            Chọn Ngày hẹn
          </h2>
          <input
            type="date"
            value={dateInput}
            min={today}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary/20"
          />

          <div className="p-3 rounded-lg bg-surface-container-low text-body-sm text-body-sm text-on-surface-variant flex flex-col gap-1">
            <span className="font-bold text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
              Lưu ý hệ thống:
            </span>
            <span>
              API `available-slots` trả về khung giờ khả dụng theo ca làm việc đã đăng ký của chuyên viên.
            </span>
          </div>
        </div>

        {/* Time Slots Area (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Các khung giờ trống ({dateInput})
            </h2>
            {loadingSlots && (
              <span className="font-label-sm text-label-sm text-primary animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                Đang tìm khung giờ...
              </span>
            )}
          </div>

          {/* Handle 404 NotFound or Empty Slots */}
          {isNotFound || rawSlots.length === 0 ? (
            <div className="py-10 px-4 text-center rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[36px]">event_busy</span>
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[12px] font-bold self-center mb-1">
                  API Response 404: Available slot not found
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Không tìm thấy khung giờ trống cho ngày {dateInput}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {slotsRes?.message ||
                    'Hiện tại chưa có ca làm việc nào hoặc các ca đã được chốt kín chỗ trong ngày bạn chọn.'}
                </p>
              </div>

              {/* Quick Actions for 404 state */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSelectTomorrow}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  <span>Thử chọn Ngày mai</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/booking/step-1')}
                  className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container border border-outline-variant/30 transition-all shadow-sm"
                >
                  Đổi Chuyên gia khác
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md">
              {rawSlots.map((slot: any, idx: number) => {
                const isSelected =
                  selectedSlot?.startTime === slot.startTime &&
                  selectedSlot?.endTime === slot.endTime &&
                  selectedDate === dateInput;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-space-md rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-primary bg-primary-container text-on-primary shadow-md'
                        : 'border-outline-variant/30 bg-surface-container-low hover:border-primary/50 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-label-md text-label-md font-bold ${
                          isSelected ? 'text-on-primary' : 'text-primary'
                        }`}
                      >
                        {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[18px] text-on-primary">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[12px] ${
                        isSelected ? 'text-on-primary/90' : 'text-on-surface-variant'
                      }`}
                    >
                      {slot.staffName || selectedStaff?.fullName || selectedStaff?.fullname || 'Chuyên viên sẵn sàng'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-space-lg">
        <button
          type="button"
          onClick={() => router.push('/booking/step-1')}
          className="px-6 py-3 rounded-xl bg-surface-container-low text-on-surface font-label-lg text-label-lg hover:bg-surface-container transition-colors font-semibold"
        >
          Quay lại Bước 1
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedSlot || isNotFound}
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container disabled:opacity-50 transition-all font-bold flex items-center gap-2"
        >
          <span>Tiếp tục: Xác nhận & Đặt lịch</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
