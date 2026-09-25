'use client';

import { useState } from 'react';
import { useAllBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { BookingResponse } from '@/types/booking.types';

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Fetch real data from backend
  const { data: apiResponse, isLoading, isError, refetch } = useAllBookings({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const updateStatusMutation = useUpdateBookingStatus();

  // Extract booking list
  const pagedData = apiResponse?.data;
  const rawBookings: BookingResponse[] = pagedData?.data || [];

  // Rich mock data for demo when backend database is empty
  const mockBookings: BookingResponse[] = [
    {
      id: 'bk-101',
      bookingCode: '#BK-8821',
      customerId: 'cust-1',
      serviceId: 'srv-1',
      serviceName: 'Hydra Facial Chuyên Sâu',
      staffId: 'staff-1',
      staffName: 'BS. Thùy Linh',
      bookingDate: '2026-09-25',
      startTime: '09:00:00',
      endTime: '10:30:00',
      customerNote: 'Da nhạy cảm, nhờ BS kiểm tra trước khi làm',
      status: 'Pending',
      createdAt: '2026-09-24T10:15:00',
    },
    {
      id: 'bk-102',
      bookingCode: '#BK-8822',
      customerId: 'cust-2',
      serviceId: 'srv-2',
      serviceName: 'Lấy cao răng & Niềng răng tư vấn',
      staffId: 'staff-2',
      staffName: 'BS. Hoàng Nam',
      bookingDate: '2026-09-25',
      startTime: '10:30:00',
      endTime: '11:30:00',
      customerNote: 'Khách yêu cầu phòng yên tĩnh',
      status: 'Confirmed',
      createdAt: '2026-09-24T11:00:00',
    },
    {
      id: 'bk-103',
      bookingCode: '#BK-8823',
      customerId: 'cust-3',
      serviceId: 'srv-3',
      serviceName: 'Massage Đá Nóng Toàn Thân',
      staffId: 'staff-3',
      staffName: 'KTV. Thu Thảo',
      bookingDate: '2026-09-25',
      startTime: '13:30:00',
      endTime: '15:00:00',
      customerNote: 'Đã cọc qua MoMo',
      status: 'Confirmed',
      createdAt: '2026-09-24T14:20:00',
    },
    {
      id: 'bk-104',
      bookingCode: '#BK-8824',
      customerId: 'cust-4',
      serviceId: 'srv-4',
      serviceName: 'Cấy Tinh Chất Trẻ Hóa Da',
      staffId: 'staff-1',
      staffName: 'BS. Thùy Linh',
      bookingDate: '2026-09-25',
      startTime: '15:30:00',
      endTime: '17:00:00',
      status: 'Completed',
      createdAt: '2026-09-24T08:30:00',
    },
    {
      id: 'bk-105',
      bookingCode: '#BK-8825',
      customerId: 'cust-5',
      serviceId: 'srv-5',
      serviceName: 'Khám & Điều trị Mụn Chuẩn Y Khoa',
      staffId: 'staff-4',
      staffName: 'KTV. Lê Thanh',
      bookingDate: '2026-09-26',
      startTime: '09:00:00',
      endTime: '10:00:00',
      status: 'Pending',
      createdAt: '2026-09-25T07:45:00',
    },
    {
      id: 'bk-106',
      bookingCode: '#BK-8826',
      customerId: 'cust-6',
      serviceId: 'srv-6',
      serviceName: 'Phục Hồi Tóc Keratin Chuyên Sâu',
      staffId: 'staff-5',
      staffName: 'Stylist: Tuấn Anh',
      bookingDate: '2026-09-24',
      startTime: '16:00:00',
      endTime: '17:30:00',
      customerNote: 'Khách xin hủy do bận lịch đột xuất',
      status: 'Cancelled',
      cancellationReason: 'Bận đột xuất',
      createdAt: '2026-09-23T16:10:00',
    },
  ];

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
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerNote?.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setUpdatingId(id);
    updateStatusMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          setUpdatingId(null);
          if (selectedBooking && selectedBooking.id === id) {
            setSelectedBooking({ ...selectedBooking, status: newStatus });
          }
          refetch();
        },
        onError: () => {
          setUpdatingId(null);
        },
      }
    );
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbeafe] text-[#1e40af] font-label-sm text-[12px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            Đã xác nhận
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef3c7] text-[#92400e] font-label-sm text-[12px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
            Chờ duyệt
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-label-sm text-[12px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            Hoàn thành
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee2e2] text-[#991b1b] font-label-sm text-[12px] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[12px]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-space-xl flex flex-col gap-space-lg w-full max-w-[1600px] mx-auto">
      {/* Header & Actions Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Vận hành hệ thống &amp; Tiếp nhận
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Quản trị Admin
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mt-0.5">
            Quản lý Đặt Lịch &amp; Booking
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Theo dõi danh sách đặt lịch toàn hệ thống, xác nhận trạng thái và điều phối nhân sự.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-space-sm">
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-space-xs bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg px-space-md py-2.5 rounded-lg shadow-sm transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[19px] text-tertiary">sync</span>
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-space-xs bg-primary-container hover:brightness-110 text-on-primary font-label-lg text-label-lg px-space-md py-2.5 rounded-lg shadow-sm transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>+ Tạo booking tại quầy</span>
          </button>
        </div>
      </div>

      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1: Tổng booking */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Tổng booking
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-display text-headline-lg font-bold text-on-surface">
                  {counts.all}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  lượt hẹn
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant">
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-semibold bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> Tất cả
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Dữ liệu hiện tại</span>
          </div>
        </div>

        {/* Card 2: Chờ duyệt */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Chờ duyệt
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-display text-headline-lg font-bold text-[#b45309]">
                  {counts.pending}
                </span>
                <span className="font-label-md text-label-md text-[#b45309] font-medium">
                  cần xử lý
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between">
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mr-space-sm">
              <div
                className="bg-[#f59e0b] h-full rounded-full transition-all"
                style={{ width: `${counts.all ? (counts.pending / counts.all) * 100 : 0}%` }}
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap font-medium">
              {counts.pending} đơn
            </span>
          </div>
        </div>

        {/* Card 3: Đã xác nhận */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Đã xác nhận
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-display text-headline-lg font-bold text-[#1e40af]">
                  {counts.confirmed}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  ca giữ chỗ
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm font-semibold text-primary">Sẵn sàng phục vụ</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Đã lên lịch</span>
          </div>
        </div>

        {/* Card 4: Complete */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group border border-outline-variant/20">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Đã hoàn thành
              </span>
              <div className="flex items-baseline gap-space-xs mt-2">
                <span className="font-display text-headline-lg font-bold text-[#065f46]">
                  {counts.completed}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  / {counts.all} lịch
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
          </div>
          <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Trạng thái:</span>
            <span className="font-label-md text-label-md font-bold text-[#065f46]">Phục vụ xong</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo mã booking (#BK...), chuyên viên, dịch vụ, ghi chú..."
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md pl-10 pr-space-md py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="md:col-span-5 flex items-center bg-surface-container-low p-1 rounded-lg overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`flex-1 min-w-[70px] py-1.5 text-center font-label-md text-label-md rounded transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Tất cả ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Pending')}
              className={`flex-1 min-w-[85px] py-1.5 text-center font-label-md text-label-md rounded transition-all ${
                statusFilter === 'Pending'
                  ? 'bg-surface-container-lowest text-[#b45309] font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Chờ duyệt ({counts.pending})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Confirmed')}
              className={`flex-1 min-w-[90px] py-1.5 text-center font-label-md text-label-md rounded transition-all ${
                statusFilter === 'Confirmed'
                  ? 'bg-surface-container-lowest text-[#1e40af] font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Xác nhận ({counts.confirmed})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Completed')}
              className={`flex-1 min-w-[90px] py-1.5 text-center font-label-md text-label-md rounded transition-all ${
                statusFilter === 'Completed'
                  ? 'bg-surface-container-lowest text-[#065f46] font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Xong ({counts.completed})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Cancelled')}
              className={`flex-1 min-w-[75px] py-1.5 text-center font-label-md text-label-md rounded transition-all ${
                statusFilter === 'Cancelled'
                  ? 'bg-surface-container-lowest text-[#991b1b] font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Hủy ({counts.cancelled})
            </button>
          </div>

          {/* View Switcher */}
          <div className="md:col-span-2 flex items-center justify-end gap-1 bg-surface-container-low p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex-1 py-1.5 flex items-center justify-center gap-1 text-label-md font-label-md rounded transition-all ${
                viewMode === 'table'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">table_rows</span>
              <span>Bảng</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex-1 py-1.5 flex items-center justify-center gap-1 text-label-md font-label-md rounded transition-all ${
                viewMode === 'cards'
                  ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Thẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 flex flex-col items-center justify-center gap-3 border border-outline-variant/20 shadow-sm">
          <span className="material-symbols-outlined text-[36px] text-primary animate-spin">
            sync
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant font-medium">
            Đang tải dữ liệu danh sách Booking...
          </p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center flex flex-col items-center justify-center gap-2 border border-outline-variant/20 shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
            event_busy
          </span>
          <p className="font-title-md text-title-md text-on-surface font-semibold">
            Không tìm thấy booking nào
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Thử lọc lại theo từ khóa hoặc bộ lọc trạng thái khác.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Data Table View */
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-body-md font-body-md whitespace-nowrap">
              <thead className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 pl-space-lg pr-space-md" scope="col">
                    Mã Booking
                  </th>
                  <th className="py-3.5 px-space-md" scope="col">
                    Dịch vụ
                  </th>
                  <th className="py-3.5 px-space-md" scope="col">
                    Chuyên viên / KTV
                  </th>
                  <th className="py-3.5 px-space-md" scope="col">
                    Thời gian hẹn
                  </th>
                  <th className="py-3.5 px-space-md" scope="col">
                    Ghi chú khách
                  </th>
                  <th className="py-3.5 px-space-md" scope="col">
                    Trạng thái
                  </th>
                  <th className="py-3.5 pl-space-md pr-space-lg text-right" scope="col">
                    Thao tác Admin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                {filteredBookings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="py-space-md pl-space-lg pr-space-md">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-bold text-primary">
                          {item.bookingCode}
                        </span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">
                          Tạo: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                        </span>
                      </div>
                    </td>

                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">medical_services</span>
                        </span>
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">
                          {item.serviceName}
                        </span>
                      </div>
                    </td>

                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          person
                        </span>
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          {item.staffName}
                        </span>
                      </div>
                    </td>

                    <td className="py-space-md px-space-md">
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface font-semibold">
                          {item.bookingDate}
                        </span>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                    </td>

                    <td className="py-space-md px-space-md max-w-xs truncate">
                      <span className="font-body-sm text-body-sm text-on-surface-variant italic">
                        {item.customerNote || '---'}
                      </span>
                    </td>

                    <td className="py-space-md px-space-md">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-space-md pl-space-md pr-space-lg text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick action buttons depending on status */}
                        {item.status === 'Pending' && (
                          <button
                            type="button"
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, 'Confirmed')}
                            className="px-2.5 py-1 rounded bg-[#2563eb] text-white font-label-sm text-label-sm font-semibold hover:brightness-110 transition-all flex items-center gap-1 shadow-sm"
                            title="Xác nhận lịch hẹn"
                          >
                            {updatingId === item.id ? (
                              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                            ) : (
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            )}
                            Duyệt
                          </button>
                        )}

                        {item.status === 'Confirmed' && (
                          <button
                            type="button"
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, 'Completed')}
                            className="px-2.5 py-1 rounded bg-[#10b981] text-white font-label-sm text-label-sm font-semibold hover:brightness-110 transition-all flex items-center gap-1 shadow-sm"
                            title="Đánh dấu đã hoàn thành"
                          >
                            {updatingId === item.id ? (
                              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                            ) : (
                              <span className="material-symbols-outlined text-[14px]">task_alt</span>
                            )}
                            Xong
                          </button>
                        )}

                        {item.status !== 'Cancelled' && item.status !== 'Completed' && (
                          <button
                            type="button"
                            disabled={updatingId === item.id}
                            onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                            className="px-2.5 py-1 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold hover:bg-error/20 transition-all flex items-center gap-1"
                            title="Hủy booking này"
                          >
                            <span className="material-symbols-outlined text-[14px]">cancel</span>
                            Hủy
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBooking(item);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container font-label-sm text-label-sm transition-colors border border-outline-variant/30"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filteredBookings.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 hover:shadow-md transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2.5">
                <span className="font-label-md text-label-md font-bold text-primary">
                  {item.bookingCode}
                </span>
                {getStatusBadge(item.status)}
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-title-md text-title-md font-bold text-on-surface">
                  {item.serviceName}
                </h3>
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    person
                  </span>
                  <span>Chuyên viên: {item.staffName}</span>
                </div>
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    schedule
                  </span>
                  <span>
                    {item.bookingDate} | {item.startTime} - {item.endTime}
                  </span>
                </div>
                {item.customerNote && (
                  <p className="text-[12px] text-on-surface-variant italic bg-surface-container-low p-2 rounded-lg mt-1">
                    Ghi chú: {item.customerNote}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBooking(item);
                    setIsDetailModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
                >
                  Xem chi tiết
                </button>

                <div className="flex items-center gap-1.5">
                  {item.status === 'Pending' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-[#2563eb] text-white font-label-md text-label-md font-semibold hover:brightness-110 transition-all shadow-sm"
                    >
                      Duyệt
                    </button>
                  )}
                  {item.status === 'Confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'Completed')}
                      className="px-3 py-1.5 rounded-lg bg-[#10b981] text-white font-label-md text-label-md font-semibold hover:brightness-110 transition-all shadow-sm"
                    >
                      Xong
                    </button>
                  )}
                  {item.status !== 'Cancelled' && item.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                      className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md font-semibold hover:bg-error/20 transition-all"
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Booking Detail & Action Modal */}
      {isDetailModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">
                  wysiwyg
                </span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Chi Tiết Booking {selectedBooking.bookingCode}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl">
                <span className="font-label-md text-label-md text-on-surface-variant">Trạng thái hiện tại:</span>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-body-sm text-body-sm">
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Dịch vụ:</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    {selectedBooking.serviceName}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Chuyên viên:</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    {selectedBooking.staffName}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Ngày hẹn:</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    {selectedBooking.bookingDate}
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Khung giờ:</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </span>
                </div>
              </div>

              {selectedBooking.customerNote && (
                <div className="p-3 bg-surface-container-low rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Ghi chú của khách hàng:
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface italic">
                    {selectedBooking.customerNote}
                  </p>
                </div>
              )}

              {selectedBooking.cancellationReason && (
                <div className="p-3 bg-error-container/40 rounded-xl flex flex-col gap-1 text-on-error-container">
                  <span className="font-label-sm text-label-sm font-bold">Lý do hủy:</span>
                  <p className="font-body-sm text-body-sm italic">
                    {selectedBooking.cancellationReason}
                  </p>
                </div>
              )}
            </div>

            {/* Change Status Action Group */}
            <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
              <span className="font-label-md text-label-md text-on-surface font-bold">
                Cập nhật trạng thái Booking (PATCH /api/Bookings/{'{id}'}/status):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={selectedBooking.status === 'Pending' || updatingId === selectedBooking.id}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Pending')}
                  className="px-3 py-1.5 rounded-lg bg-[#fef3c7] text-[#92400e] font-label-md text-label-md hover:brightness-95 disabled:opacity-50 transition-all font-semibold"
                >
                  Chờ duyệt
                </button>
                <button
                  type="button"
                  disabled={selectedBooking.status === 'Confirmed' || updatingId === selectedBooking.id}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Confirmed')}
                  className="px-3 py-1.5 rounded-lg bg-[#2563eb] text-white font-label-md text-label-md hover:brightness-110 disabled:opacity-50 transition-all font-semibold"
                >
                  Duyệt / Xác nhận
                </button>
                <button
                  type="button"
                  disabled={selectedBooking.status === 'Completed' || updatingId === selectedBooking.id}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Completed')}
                  className="px-3 py-1.5 rounded-lg bg-[#10b981] text-white font-label-md text-label-md hover:brightness-110 disabled:opacity-50 transition-all font-semibold"
                >
                  Hoàn thành
                </button>
                <button
                  type="button"
                  disabled={selectedBooking.status === 'Cancelled' || updatingId === selectedBooking.id}
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'Cancelled')}
                  className="px-3 py-1.5 rounded-lg bg-error text-on-error font-label-md text-label-md hover:brightness-110 disabled:opacity-50 transition-all font-semibold"
                >
                  Hủy booking
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
