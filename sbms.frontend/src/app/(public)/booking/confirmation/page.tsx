'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateBooking } from '@/hooks/useBookings';
import { useBookingStore } from '@/store/bookingStore';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const {
    selectedService,
    selectedStaff,
    selectedDate,
    selectedSlot,
    customerNote,
    setCustomerNote,
    resetBooking,
  } = useBookingStore();

  const createBookingMutation = useCreateBooking();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedSlot || !selectedDate) {
      setErrorMsg('Thông tin đặt lịch chưa đầy đủ. Vui lòng quay lại các bước trước!');
      return;
    }

    setErrorMsg(null);

    const payload = {
      bookingCode: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: selectedService.id,
      staffId: selectedStaff?.id || selectedSlot.staffId,
      bookingDate: selectedDate,
      startTime: selectedSlot.startTime,
      durationMinutes: selectedService.durationMinutes || 60,
      customerNote: customerNote || 'Khách đặt qua Website SBMS',
      status: 'Pending',
    };

    createBookingMutation.mutate(payload, {
      onSuccess: (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          setSuccessMsg('Đặt lịch thành công! Đang chuyển hướng tới danh sách lịch hẹn của bạn...');
          resetBooking();
          setTimeout(() => {
            router.push('/my-bookings');
          }, 1500);
        } else {
          setErrorMsg(res.message || 'Không thể tạo lịch hẹn. Vui lòng thử lại!');
        }
      },
      onError: (err: any) => {
        setErrorMsg(
          err?.response?.data?.message ||
            'Tạo lịch hẹn thất bại. Vui lòng kiểm tra lại khung giờ và nhân viên!'
        );
      },
    });
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
          {/* Step 2 (Completed) */}
          <div
            onClick={() => router.push('/booking/step-2')}
            className="flex items-center gap-space-sm cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">check</span>
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-tertiary uppercase">Bước 2</span>
              <span className="font-label-md text-label-md text-on-surface truncate block">
                {selectedDate} ({selectedSlot?.startTime.slice(0, 5)})
              </span>
            </div>
          </div>
          {/* Step 3 (Active) */}
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Bước 3</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate block">
                Xác nhận & Hoàn tất
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-space-md">
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
          Bước 3: Nhập thông tin & Xác nhận Đặt lịch hẹn
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Kiểm tra toàn bộ chi tiết cuộc hẹn trước khi bấm nút xác nhận.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container font-body-md text-body-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant font-body-md text-body-md flex items-center gap-2 font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Confirmation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Form Details & Note (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
          <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            Ghi chú cho cuộc hẹn
          </h2>

          <div className="flex flex-col gap-space-xs">
            <label className="font-label-md text-label-md text-on-surface">
              Ghi chú thêm cho Chuyên viên / Lễ tân (Tùy chọn):
            </label>
            <textarea
              rows={4}
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Ví dụ: Ưu tiên phòng yên tĩnh, da dễ bị dị ứng..."
              className="w-full p-3 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 mt-2">
            <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
              shield
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Xác nhận giữ chỗ tự động
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Yêu cầu đặt lịch của bạn sẽ được gửi thẳng vào hệ thống `BookingsController/BookingCreateAsync` và tự động kiểm tra trùng ca làm việc.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Card (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-primary/20 flex flex-col gap-space-md">
          <h2 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/20 pb-3">
            Tóm tắt Lịch hẹn mới
          </h2>

          <div className="flex flex-col gap-space-sm text-body-md">
            <div className="flex justify-between items-center py-1">
              <span className="text-on-surface-variant font-label-md">Dịch vụ:</span>
              <span className="font-bold text-on-surface text-right">
                {selectedService?.name || 'Lấy cao răng & Thăm khám'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-on-surface-variant font-label-md">Chuyên viên:</span>
              <span className="font-semibold text-primary text-right">
                {selectedStaff?.fullName || selectedStaff?.fullname || selectedSlot?.staffName || 'BS. Hoàng Nam'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-on-surface-variant font-label-md">Ngày hẹn:</span>
              <span className="font-bold text-on-surface">
                {selectedDate || '2026-09-25'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-on-surface-variant font-label-md">Khung giờ:</span>
              <span className="font-bold text-primary">
                {selectedSlot
                  ? `${selectedSlot.startTime.slice(0, 5)} - ${selectedSlot.endTime.slice(0, 5)}`
                  : '09:30 - 11:00'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-b border-outline-variant/20 my-1">
              <span className="font-title-md text-title-md text-on-surface font-bold">Tổng thanh toán:</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {(selectedService?.price || 500000).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={createBookingMutation.isPending}
            className="w-full py-3.5 px-space-lg rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {createBookingMutation.isPending ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>Đang gửi yêu cầu...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check</span>
                <span>Xác nhận & Đặt lịch ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
