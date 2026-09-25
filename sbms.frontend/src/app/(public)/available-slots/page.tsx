'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAvailableSlots } from '@/hooks/useBookings';
import { useActiveServices } from '@/hooks/useServices';
import { useAllStaffs } from '@/hooks/useStaffs';
import { useBookingStore } from '@/store/bookingStore';

export default function AvailableSlotsPage() {
  const router = useRouter();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('ALL');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('ALL');
  const [selectedSlotItem, setSelectedSlotItem] = useState<any>(null);

  // Fetch services & staff for filter dropdowns
  const { data: servicesRes } = useActiveServices();
  const { data: staffsRes } = useAllStaffs();

  const services = servicesRes?.data || [];
  const staffs = staffsRes?.data || [];

  // Fetch available slots from API
  const { data: slotsRes, isLoading: loadingSlots, isError } = useAvailableSlots({
    fromDate: selectedDate,
    toDate: selectedDate,
    status: undefined,
  });

  const isNotFound = slotsRes?.statusCode === 404 || isError;
  const pagedData = slotsRes?.data;
  const rawSlots: any[] = Array.isArray(pagedData?.data)
    ? pagedData.data
    : Array.isArray(pagedData)
    ? pagedData
    : [];

  // Filter slots locally by staff if selectedStaffId !== 'ALL'
  const filteredSlots = rawSlots.filter((slot) => {
    if (selectedStaffId !== 'ALL' && slot.staffId !== selectedStaffId) {
      return false;
    }
    return true;
  });

  const { setDateTimeSlot, setSelectedService, setSelectedStaff, setStep } = useBookingStore();

  const handleBookSelectedSlot = (slot: any) => {
    // Set slot info into Zustand store
    setDateTimeSlot(selectedDate, slot);

    // Find staff object if present
    const matchedStaff = staffs.find((s: any) => s.id === slot.staffId);
    if (matchedStaff) {
      setSelectedStaff(matchedStaff);
    }

    // Find service object if selectedServiceId !== 'ALL'
    if (selectedServiceId !== 'ALL') {
      const matchedService = services.find((srv: any) => srv.id === selectedServiceId);
      if (matchedService) {
        setSelectedService(matchedService);
      }
    }

    setStep(1);
    router.push('/booking/step-1');
  };

  const handleSelectToday = () => {
    setSelectedDate(todayStr);
  };

  const handleSelectTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
  };

  return (
    <div className="w-full bg-surface min-h-screen py-space-lg px-gutter-sm lg:px-gutter max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
              Tra cứu Khung giờ trống
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
              Đồng bộ thời gian thực
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Tra cứu các suất lịch trống khả dụng của chuyên viên và đặt lịch giữ chỗ tức thì.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push('/booking/step-1')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-sm hover:bg-primary-container transition-all self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Đặt lịch ngay</span>
        </button>
      </div>

      {/* 2. Filter Toolbar Bar */}
      <div className="bg-surface-container-lowest p-space-md lg:p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Select Date */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Chọn Ngày tra cứu
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-primary text-[20px]">
                calendar_month
              </span>
              <input
                type="date"
                value={selectedDate}
                min={todayStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Select Service */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Loại Dịch vụ
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-primary text-[20px]">
                category
              </span>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md outline-none border border-outline-variant/30 appearance-none cursor-pointer"
              >
                <option value="ALL">Tất cả dịch vụ</option>
                {services.map((srv: any) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} ({srv.durationMinutes || 60} phút)
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[20px] text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>

          {/* Select Staff */}
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              Chuyên gia / Kỹ thuật viên
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-primary text-[20px]">
                badge
              </span>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md outline-none border border-outline-variant/30 appearance-none cursor-pointer"
              >
                <option value="ALL">Bất kỳ chuyên viên nào</option>
                {staffs.map((st: any) => (
                  <option key={st.id} value={st.id}>
                    {st.fullName || st.fullname}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 pointer-events-none text-[20px] text-on-surface-variant">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Quick Date Shortcuts & Status Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectToday}
              className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-all ${
                selectedDate === todayStr
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={handleSelectTomorrow}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm font-semibold transition-all"
            >
              Ngày mai
            </button>
          </div>

          <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span>Khung giờ khả dụng</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim" />
              <span>Đã kín chỗ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Available Slots Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Grid of Slots (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Danh sách khung giờ khả dụng ({selectedDate})
            </h2>

            {loadingSlots && (
              <span className="font-label-sm text-label-sm text-primary animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                Đang tìm kiếm...
              </span>
            )}
          </div>

          {/* 404 NotFound / Empty state */}
          {isNotFound || filteredSlots.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[36px]">event_busy</span>
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-[12px] font-bold self-center mb-1">
                  API Response 404: Available slot not found
                </span>
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  Không có khung giờ trống cho bộ lọc hiện tại
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chưa có ca làm việc nào được đăng ký hoặc các ca đã kín chỗ trong ngày{' '}
                  <strong>{selectedDate}</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSelectTomorrow}
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-sm"
                >
                  Xem ngày mai
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaffId('ALL');
                    setSelectedServiceId('ALL');
                  }}
                  className="px-4 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container border border-outline-variant/30 transition-all shadow-sm"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-md">
              {filteredSlots.map((slot: any, idx: number) => {
                const isSelected =
                  selectedSlotItem?.startTime === slot.startTime &&
                  selectedSlotItem?.endTime === slot.endTime &&
                  selectedSlotItem?.staffId === slot.staffId;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSlotItem(slot)}
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
                      className={`text-[12px] font-medium truncate ${
                        isSelected ? 'text-on-primary/90' : 'text-on-surface-variant'
                      }`}
                    >
                      {slot.staffName || 'Chuyên viên SBMS'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Slot Preview & Direct Action (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-primary/20 flex flex-col gap-space-md">
          <h2 className="font-title-md text-title-md text-on-surface font-bold border-b border-outline-variant/20 pb-3">
            Chi tiết Suất Đặt Lịch
          </h2>

          {selectedSlotItem ? (
            <div className="flex flex-col gap-space-md">
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Ngày hẹn:</span>
                  <span className="font-bold text-on-surface">{selectedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Khung giờ:</span>
                  <span className="font-bold text-primary text-headline-sm">
                    {selectedSlotItem.startTime.slice(0, 5)} - {selectedSlotItem.endTime.slice(0, 5)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Chuyên viên:</span>
                  <span className="font-semibold text-on-surface">
                    {selectedSlotItem.staffName || 'Hệ thống sắp xếp'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleBookSelectedSlot(selectedSlotItem)}
                className="w-full py-3 px-space-lg rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container transition-all font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Đặt lịch với khung giờ này</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-on-surface-variant flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-outline">touch_app</span>
              <p className="font-body-md font-medium">Nhấp vào một khung giờ bên danh sách để xem chi tiết & đặt lịch nhanh.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
