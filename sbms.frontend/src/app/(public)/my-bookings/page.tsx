'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyBookings, useCancelBooking } from '@/hooks/useBookings';
import { BookingResponse } from '@/types/booking.types';

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'schedule'>('week');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<BookingResponse | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Fetch API data via useMyBookings hook
  const { data: apiResponse, isLoading, isError, refetch } = useMyBookings({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const cancelMutation = useCancelBooking();

  // Extract booking items from API response (or fallback if empty)
  const pagedData = apiResponse?.data;
  const rawBookings: BookingResponse[] = pagedData?.data || [];

  // Mock demo bookings if real backend has no records yet
  const mockBookings: BookingResponse[] = [
    {
      id: 'mock-1',
      bookingCode: '#BK-8750',
      customerId: 'cust-1',
      serviceId: 'srv-1',
      serviceName: 'Lấy cao răng & Thăm khám tổng quát',
      staffId: 'staff-1',
      staffName: 'BS. Hoàng Nam',
      bookingDate: '2026-09-23',
      startTime: '09:30:00',
      endTime: '11:00:00',
      customerNote: 'Phòng A2 - Chăm sóc răng miệng chuyên sâu',
      status: 'Confirmed',
      createdAt: '2026-09-20T08:00:00',
    },
    {
      id: 'mock-2',
      bookingCode: '#BK-8821',
      customerId: 'cust-1',
      serviceId: 'srv-2',
      serviceName: 'Chăm sóc da Hydra',
      staffId: 'staff-2',
      staffName: 'CV. Thu Thảo',
      bookingDate: '2026-09-24',
      startTime: '15:00:00',
      endTime: '16:30:00',
      customerNote: 'Da nhạy cảm',
      status: 'Pending',
      createdAt: '2026-09-21T10:00:00',
    },
    {
      id: 'mock-3',
      bookingCode: '#BK-8692',
      customerId: 'cust-1',
      serviceId: 'srv-3',
      serviceName: 'Khám da liễu định kỳ',
      staffId: 'staff-3',
      staffName: 'BS. Lan Hương',
      bookingDate: '2026-09-21',
      startTime: '08:30:00',
      endTime: '09:30:00',
      status: 'Completed',
      createdAt: '2026-09-18T09:00:00',
    },
    {
      id: 'mock-4',
      bookingCode: '#BK-8860',
      customerId: 'cust-1',
      serviceId: 'srv-4',
      serviceName: 'Tư vấn chăm sóc cá nhân',
      staffId: 'staff-4',
      staffName: 'Coach: Minh Châu',
      bookingDate: '2026-09-25',
      startTime: '14:00:00',
      endTime: '15:20:00',
      status: 'Confirmed',
      createdAt: '2026-09-22T11:00:00',
    },
    {
      id: 'mock-5',
      bookingCode: '#BK-8902',
      customerId: 'cust-1',
      serviceId: 'srv-5',
      serviceName: 'Chăm sóc tócKeratin',
      staffId: 'staff-5',
      staffName: 'Stylist: Tuấn Anh',
      bookingDate: '2026-09-26',
      startTime: '10:00:00',
      endTime: '11:00:00',
      status: 'Pending',
      createdAt: '2026-09-23T14:00:00',
    },
    {
      id: 'mock-6',
      bookingCode: '#BK-8700',
      customerId: 'cust-1',
      serviceId: 'srv-6',
      serviceName: 'Massage body đá nóng',
      staffId: 'staff-6',
      staffName: 'KTV: Mai Hoa',
      bookingDate: '2026-09-22',
      startTime: '16:00:00',
      endTime: '17:15:00',
      status: 'Cancelled',
      cancellationReason: 'Khách bận đột xuất',
      createdAt: '2026-09-19T15:00:00',
    },
  ];

  // Use API data if present, otherwise use mock data for rich demonstration
  const displayBookings = rawBookings.length > 0 ? rawBookings : mockBookings;

  // Filter bookings based on active status filter and search query
  const filteredBookings = displayBookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      b.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate status counts
  const counts = {
    all: displayBookings.length,
    pending: displayBookings.filter((b) => b.status === 'Pending').length,
    confirmed: displayBookings.filter((b) => b.status === 'Confirmed').length,
    completed: displayBookings.filter((b) => b.status === 'Completed').length,
    cancelled: displayBookings.filter((b) => b.status === 'Cancelled').length,
  };

  // Find next upcoming booking
  const upcomingBooking =
    displayBookings.find((b) => b.status === 'Confirmed' || b.status === 'Pending') ||
    displayBookings[0];

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    setCancelError(null);
    cancelMutation.mutate(
      { id: selectedBookingForCancel.id, reason: cancelReason },
      {
        onSuccess: (data) => {
          // Backend trả 400 nếu status không phải Pending → bắt lỗi từ response
          if (data?.statusCode && data.statusCode !== 200) {
            setCancelError(data.message || 'Không thể hủy lịch hẹn này.');
            return;
          }
          setSelectedBookingForCancel(null);
          setCancelReason('');
          setCancelError(null);
          refetch();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            'Đã xảy ra lỗi khi hủy lịch. Vui lòng thử lại.';
          setCancelError(msg);
        },
      }
    );
  };

  const handleCloseModal = () => {
    setSelectedBookingForCancel(null);
    setCancelReason('');
    setCancelError(null);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span
            title="Lịch đã xác nhận — không thể tự hủy. Liên hệ hotline để được hỗ trợ."
            className="px-2 py-0.5 rounded-full bg-[#dbeafe] text-[#1e40af] font-label-sm text-[11px] font-bold cursor-default"
          >
            Đã xác nhận
          </span>
        );

      case 'Pending':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-label-sm text-[11px] font-bold">
            Chờ duyệt
          </span>
        );
      case 'Completed':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] font-label-sm text-[11px] font-bold">
            Đã xong
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#991b1b] font-label-sm text-[11px] font-bold">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col w-full py-space-lg px-gutter-sm lg:px-gutter max-w-7xl mx-auto gap-space-lg">
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
              Lịch hẹn của tôi
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {counts.all} cuộc hẹn trong danh sách
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Theo dõi trạng thái và quản lý các lịch hẹn đã đặt trong tuần
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="inline-flex p-1 rounded-xl bg-surface-container-low shadow-sm">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                viewMode === 'day'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                viewMode === 'week'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                viewMode === 'month'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setViewMode('schedule')}
              className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                viewMode === 'schedule'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Danh sách
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-label-md shadow-sm transition-colors border border-outline-variant/30"
            title="Đồng bộ Google Calendar"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">sync</span>
            <span>Đồng bộ iCal / Google Calendar</span>
          </button>

          <Link
            href="/booking/step-1"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:brightness-110 transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Đặt lịch hẹn mới</span>
          </Link>
        </div>
      </div>

      {/* 2. Date Navigator & Search Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm w-full md:w-auto justify-between md:justify-start">
          <button
            type="button"
            aria-label="Tuần trước"
            className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <div className="flex items-center gap-2 px-space-md py-1.5 rounded-lg bg-surface-container-low">
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Tuần hiện tại: 21 Th09 - 27 Th09, 2026
            </span>
          </div>
          <button
            type="button"
            aria-label="Tuần sau"
            className="p-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold hover:brightness-95 transition-all"
          >
            Hôm nay
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mã lịch hẹn (#BK-...), dịch vụ, chuyên gia..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/70 font-body-sm text-body-sm outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* 3. Status Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tất cả */}
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-all ${
              statusFilter === 'ALL'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span>Tất cả</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-primary/20 text-current font-bold text-[11px]">
              {counts.all}
            </span>
          </button>

          {/* Chờ xác nhận */}
          <button
            type="button"
            onClick={() => setStatusFilter('Pending')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-all ${
              statusFilter === 'Pending'
                ? 'bg-[#f59e0b] text-white font-bold'
                : 'bg-[#fef3c7] text-[#b45309] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>Chờ xác nhận</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/10 font-bold text-[11px]">
              {counts.pending}
            </span>
          </button>

          {/* Đã xác nhận */}
          <button
            type="button"
            onClick={() => setStatusFilter('Confirmed')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-all ${
              statusFilter === 'Confirmed'
                ? 'bg-[#2563eb] text-white font-bold'
                : 'bg-[#eff6ff] text-[#1d4ed8] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span>Đã xác nhận</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/10 font-bold text-[11px]">
              {counts.confirmed}
            </span>
          </button>

          {/* Đã hoàn thành */}
          <button
            type="button"
            onClick={() => setStatusFilter('Completed')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-all ${
              statusFilter === 'Completed'
                ? 'bg-[#10b981] text-white font-bold'
                : 'bg-[#ecfdf5] text-[#047857] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Đã hoàn thành</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/10 font-bold text-[11px]">
              {counts.completed}
            </span>
          </button>

          {/* Đã hủy */}
          <button
            type="button"
            onClick={() => setStatusFilter('Cancelled')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-label-sm text-label-sm shadow-sm transition-all ${
              statusFilter === 'Cancelled'
                ? 'bg-[#ef4444] text-white font-bold'
                : 'bg-[#fef2f2] text-[#b91c1c] hover:brightness-95'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span>Đã hủy</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/10 font-bold text-[11px]">
              {counts.cancelled}
            </span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-space-md text-on-surface-variant font-label-sm text-label-sm shrink-0">
          <span className="hidden sm:inline text-on-surface-variant/80">Chú thích nhãn:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#f59e0b]" />
            <span>Cần duyệt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2563eb]" />
            <span>Đã chốt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
            <span>Thành công</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" />
            <span>Hủy</span>
          </div>
        </div>
      </div>

      {/* 4. Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left/Center Column: Calendar or List View (8 cols) */}
        <div className="xl:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="flex items-center justify-between px-space-md py-3 border-b border-outline-variant/20 bg-surface-container-lowest">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  calendar_today
                </span>
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  Danh sách Lịch hẹn
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                GMT+7 (Giờ VN)
              </span>
            </div>

            {isLoading && (
              <span className="text-primary font-label-sm text-label-sm animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                Đang tải dữ liệu...
              </span>
            )}
          </div>

          {/* Bookings Card List */}
          <div className="p-space-md flex flex-col gap-space-md">
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
                  event_busy
                </span>
                <p className="font-title-md text-title-md text-on-surface font-semibold">
                  Không tìm thấy lịch hẹn nào
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.
                </p>
              </div>
            ) : (
              filteredBookings.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">medical_services</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                          {item.bookingCode}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        {item.serviceName}
                      </h3>
                      <div className="flex items-center gap-4 text-body-sm text-body-sm text-on-surface-variant flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            schedule
                          </span>
                          {item.bookingDate} | {item.startTime} - {item.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            person
                          </span>
                          {item.staffName}
                        </span>
                      </div>
                      {item.customerNote && (
                        <p className="text-[12px] text-on-surface-variant italic mt-0.5">
                          Ghi chú: {item.customerNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Backend chỉ cho hủy khi status === Pending */}
                    {item.status === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => { setCancelError(null); setSelectedBookingForCancel(item); }}
                        className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container hover:bg-error/20 font-label-md text-label-md transition-colors"
                      >
                        Hủy lịch
                      </button>
                    )}
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-primary font-label-md text-label-md shadow-sm border border-outline-variant/30 transition-colors"
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Card & Guidelines (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-space-lg">
          {/* Upcoming Card */}
          {upcomingBooking && (
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-md relative overflow-hidden border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm shadow-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>Lịch hẹn sắp tới</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  {upcomingBooking.bookingCode}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {upcomingBooking.serviceName}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chuyên viên phụ trách: {upcomingBooking.staffName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-space-sm p-3 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Ngày & Giờ:</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {upcomingBooking.bookingDate} ({upcomingBooking.startTime.slice(0, 5)})
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Trạng thái:</span>
                  <div>{getStatusBadge(upcomingBooking.status)}</div>
                </div>
              </div>

              {/* QR Code Module */}
              <div className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-low">
                <div className="w-16 h-16 bg-surface-container-lowest rounded-lg p-1.5 flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/30">
                  <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 2h4v4h-4v-4zm-4-4h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v4h-2v-4zm2-2h2v2h-2v-2z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Mã QR Check-in
                  </span>
                  <p className="font-body-sm text-[12px] text-on-surface-variant">
                    Đưa mã này cho lễ tân khi tới cơ sở để check-in nhanh.
                  </p>
                </div>
              </div>

              {/* Hotline Buttons */}
              <div className="grid grid-cols-2 gap-space-sm pt-1">
                <a
                  href="tel:19001234"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                  <span>Hotline</span>
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-tertiary-container text-on-tertiary hover:brightness-110 font-label-md text-label-md transition-colors shadow-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Zalo Support</span>
                </a>
              </div>
            </div>
          )}

          {/* Loyalty & Monthly Stats Card */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Hoạt động thành viên
              </span>
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                Tháng 09/2026
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {counts.all}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Lịch đã đặt</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col">
                <span className="font-headline-sm text-headline-sm text-[#047857] font-bold">100%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Đúng giờ</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col">
                <span className="font-headline-sm text-headline-sm text-[#b45309] font-bold">850</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1">Điểm tích lũy</span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-[24px] text-primary shrink-0 mt-0.5">
              info
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Quy định hủy lịch hẹn
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Quý khách có thể tự do hủy hoặc thay đổi lịch hẹn trước ít nhất <strong>4 tiếng</strong> so với giờ bắt đầu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Cancel Booking Confirmation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">warning</span>
                Xác nhận Hủy lịch hẹn
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Error Banner from API */}
            {cancelError && (
              <div className="flex items-start gap-2 p-3 bg-error-container/60 text-on-error-container rounded-xl border border-error/20">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
                <p className="font-body-sm text-body-sm">{cancelError}</p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Bạn có chắc chắn muốn hủy lịch hẹn <strong>{selectedBookingForCancel.bookingCode}</strong> ({selectedBookingForCancel.serviceName}) vào ngày <strong>{selectedBookingForCancel.bookingDate}</strong>?
              </p>
              <div className="flex items-center gap-2 px-3 py-2 bg-[#fef3c7] text-[#92400e] rounded-lg text-[12px] font-medium">
                <span className="material-symbols-outlined text-[16px] shrink-0">info</span>
                <span>Chỉ có thể hủy khi lịch hẹn đang ở trạng thái <strong>Chờ duyệt</strong>. Lịch đã xác nhận hoặc hoàn thành không thể tự hủy.</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Lý do hủy lịch:
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy lịch hẹn..."
                className="w-full p-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm border border-outline-variant/30 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
              >
                Trở lại
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 rounded-lg bg-error text-on-error hover:brightness-110 font-label-md text-label-md font-semibold transition-all flex items-center gap-2"
              >
                {cancelMutation.isPending && (
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                )}
                <span>Xác nhận Hủy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
