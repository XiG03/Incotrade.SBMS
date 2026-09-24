'use client';

import React, { useState, useEffect } from 'react';
import { staffService } from '@/services/staff.service';
import { StaffResponse, ScheduleResponse, CreateStaffScheduleRequest } from '@/types/staff.types';

export default function ScheduleManagementPage() {
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [schedulesMap, setSchedulesMap] = useState<Record<string, ScheduleResponse[]>>({});
  const [loading, setLoading] = useState(true);

  // View state: 'week' | 'day' | 'month'
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'month'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalStaffId, setModalStaffId] = useState('');
  const [modalWorkDate, setModalWorkDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [modalShiftType, setModalShiftType] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [modalStartTime, setModalStartTime] = useState('08:00');
  const [modalEndTime, setModalEndTime] = useState('12:30');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate days of current week
  const getDaysOfWeek = (offset: number) => {
    const curr = new Date();
    const firstDay = curr.getDate() - curr.getDay() + 1 + offset * 7;
    const days = [];
    const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.setDate(firstDay + i));
      days.push({
        dayName: dayNames[i],
        dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        fullDate: d.toISOString().split('T')[0],
      });
    }
    return days;
  };

  const weekDays = getDaysOfWeek(currentWeekOffset);

  // Fetch all staff members and their schedules
  const fetchStaffAndSchedules = async () => {
    setLoading(true);
    try {
      const response = await staffService.getAllStaff();
      let staffData: StaffResponse[] = [];
      if (response.statusCode === 200 && response.data && response.data.length > 0) {
        staffData = response.data;
      } else {
        // Fallback default mock staff if backend table is newly seeded
        staffData = [
          { id: 'e1111111-1111-1111-1111-111111111111', fullname: 'BS. Hoàng Nam', email: 'hoangnam@sbms.vn', isActive: true },
          { id: 'e2222222-2222-2222-2222-222222222222', fullname: 'ThS. BS. Thùy Linh', email: 'thuylinh@sbms.vn', isActive: true },
          { id: 'e3333333-3333-3333-3333-333333333333', fullname: 'KTV. Thu Thảo', email: 'thuthao@sbms.vn', isActive: true },
          { id: 'e4444444-4444-4444-4444-444444444444', fullname: 'KTV. Lê Thanh', email: 'lethanh@sbms.vn', isActive: true },
        ];
      }

      setStaffList(staffData);
      if (staffData.length > 0 && !selectedStaffId) {
        setSelectedStaffId(staffData[0].id);
      }

      // Fetch schedules for each staff member
      const newSchedulesMap: Record<string, ScheduleResponse[]> = {};
      for (const staff of staffData) {
        try {
          const schedRes = await staffService.getStaffSchedules(staff.id);
          if (schedRes.statusCode === 200 && schedRes.data) {
            newSchedulesMap[staff.id] = schedRes.data;
          } else {
            newSchedulesMap[staff.id] = [];
          }
        } catch {
          newSchedulesMap[staff.id] = [];
        }
      }
      setSchedulesMap(newSchedulesMap);
    } catch (err) {
      console.error('Error fetching staff schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndSchedules();
  }, []);

  // Update time when shift type changes
  const handleShiftTypeChange = (type: 'morning' | 'afternoon' | 'evening') => {
    setModalShiftType(type);
    if (type === 'morning') {
      setModalStartTime('08:00');
      setModalEndTime('12:30');
    } else if (type === 'afternoon') {
      setModalStartTime('13:00');
      setModalEndTime('17:30');
    } else if (type === 'evening') {
      setModalStartTime('17:30');
      setModalEndTime('21:00');
    }
  };

  // Helper functions for DateOnly (YYYY-MM-DD) and TimeOnly (HH:mm:ss) string formats
  const formatTimeOnly = (timeStr?: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('T')) {
      const parts = timeStr.split('T')[1];
      return parts ? parts.substring(0, 5) : timeStr;
    }
    return timeStr.substring(0, 5);
  };

  const formatDateOnly = (dateStr?: string) => {
    if (!dateStr) return '';
    const cleanDate = dateStr.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  // Handle Create Schedule Submit
  const handleCreateScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStaffId) {
      setFormError('Vui lòng chọn nhân sự!');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      // Backend expects TimeOnly ("HH:mm:ss") and DateOnly ("YYYY-MM-DD") strings
      const startTimeFormatted = modalStartTime.length === 5 ? `${modalStartTime}:00` : modalStartTime;
      const endTimeFormatted = modalEndTime.length === 5 ? `${modalEndTime}:00` : modalEndTime;

      const payload: CreateStaffScheduleRequest = {
        staffId: modalStaffId,
        workDate: modalWorkDate,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
      };

      const response = await staffService.createStaffSchedule(modalStaffId, payload);
      if (response.statusCode === 200 || response.statusCode === 201) {
        setIsCreateModalOpen(false);
        fetchStaffAndSchedules();
      } else {
        setFormError(response.message || 'Tạo ca làm việc thất bại!');
      }
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo ca làm việc');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-space-lg lg:p-space-xl flex flex-col gap-space-lg max-w-[1600px] mx-auto w-full">
      {/* Top Header: Title & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer">Quản trị ca trực & Nhân sự</span>
            <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            <span className="text-primary font-semibold">Quản lý Lịch & Ca làm việc</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Quản lý Lịch & Ca làm việc{' '}
            <span className="font-title-md text-title-md font-semibold text-primary bg-primary-fixed px-space-xs py-0.5 rounded-md align-middle ml-2">
              Calendar trực quan
            </span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Theo dõi thời gian thực phân bổ ca trực theo trục giờ, điều phối phòng trị liệu và lịch làm việc của Bác sĩ & KTV trên hệ thống SBMS.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-secondary-container text-on-secondary-fixed font-label-lg text-label-lg hover:bg-surface-variant transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">auto_fix_high</span>
            <span>AI Auto-schedule</span>
          </button>
          <button
            type="button"
            onClick={fetchStaffAndSchedules}
            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container-low shadow-sm font-label-lg text-label-lg transition-all border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">refresh</span>
            <span>Tải lại</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setModalStaffId(staffList[0]?.id || '');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Xếp ca trực mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Nhân sự trực hôm nay
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">{staffList.length}</span>
                <span className="font-title-md text-title-md text-outline">/ {staffList.length} nhân sự</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">badge</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-surface-container-high text-label-sm font-label-sm">
            <span className="text-on-surface-variant">Bác sĩ & KTV chuyên khoa</span>
            <span className="font-bold text-primary">100% Sẵn sàng</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Tỷ lệ phủ ca tuần này
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">94.2%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">donut_large</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-surface-container-high text-label-sm font-label-sm">
            <span className="text-tertiary font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+3.5% tuần này
            </span>
            <span className="text-on-surface-variant">Mục tiêu: 95%</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Đổi ca chờ duyệt
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">02</span>
                <span className="font-body-md text-body-md text-on-surface-variant">yêu cầu</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-surface-container-high text-label-sm font-label-sm">
            <span className="text-error font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>Cần duyệt trong ngày
            </span>
            <span className="text-primary font-semibold hover:underline cursor-pointer">Xử lý</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                Tổng ca đã xếp
              </span>
              <div className="flex items-baseline gap-space-xs mt-1">
                <span className="font-headline-md text-headline-md font-bold text-primary">
                  {Object.values(schedulesMap).reduce((acc, curr) => acc + curr.length, 0)}
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">ca trực</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-surface-container-high text-label-sm font-label-sm">
            <span className="text-on-surface-variant">Đã kết nối API .NET</span>
            <span className="text-tertiary font-semibold">Tự động đồng bộ</span>
          </div>
        </div>
      </div>

      {/* Calendar Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-space-md">
          {/* Week Nav */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-container-lowest text-on-surface transition-all"
                title="Tuần trước"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentWeekOffset(0)}
                className="px-space-sm h-8 flex items-center justify-center rounded-md hover:bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold transition-all"
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-container-lowest text-on-surface transition-all"
                title="Tuần sau"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
            <div className="flex items-center gap-space-xs pl-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">calendar_today</span>
              <span className="font-title-md text-title-md text-on-surface font-bold">Tuần này:</span>
              <span className="font-body-md text-body-md text-on-surface-variant font-medium">
                {weekDays[0].dateStr} - {weekDays[6].dateStr}
              </span>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/20 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-space-md py-1.5 rounded-md font-label-md transition-all ${
                viewMode === 'day' ? 'bg-primary-container text-on-primary font-semibold shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              Ngày
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-space-md py-1.5 rounded-md font-label-md transition-all flex items-center gap-1 ${
                viewMode === 'week' ? 'bg-primary-container text-on-primary font-semibold shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_week</span>
              Tuần
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-space-md py-1.5 rounded-md font-label-md transition-all ${
                viewMode === 'month' ? 'bg-primary-container text-on-primary font-semibold shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              Tháng
            </button>
          </div>

          {/* Staff Filter Dropdown */}
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-on-surface-variant font-semibold">Chọn Nhân Sự:</span>
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="bg-surface-container-low text-on-surface font-label-md px-space-md py-1.5 rounded-lg border border-outline-variant/20 focus:outline-none"
            >
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.fullname} ({staff.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
          <span className="font-bold text-on-surface flex items-center gap-space-xs text-[11px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[15px] text-primary">palette</span>
            Chú giải ca trực:
          </span>
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary-fixed border border-primary/30"></span>
              <span className="text-on-surface-variant">Ca Sáng (08:00 - 12:30)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-tertiary-fixed border border-tertiary/30"></span>
              <span className="text-on-surface-variant">Ca Chiều (13:00 - 17:30)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-secondary-container border border-secondary/30"></span>
              <span className="text-on-surface-variant">Ca Tối (17:30 - 21:00)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid + Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Calendar Grid Column (9 Cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-space-xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px] animate-spin text-primary mb-2">sync</span>
              <p>Đang tải lịch ca làm việc...</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <div className="min-w-[700px]">
                {/* Header Row: Days */}
                <div className="grid grid-cols-7 bg-surface-container-low border-b border-outline-variant/30 text-center">
                  {weekDays.map((day) => (
                    <div key={day.fullDate} className="py-space-sm px-1 border-r border-outline-variant/20 flex flex-col items-center">
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{day.dayName}</span>
                      <span className="font-title-md text-title-md font-bold text-on-surface">{day.dateStr}</span>
                    </div>
                  ))}
                </div>

                {/* Calendar Body: Staff Shifts */}
                <div className="divide-y divide-outline-variant/20">
                  {staffList.map((staff) => {
                    const staffSchedules = schedulesMap[staff.id] || [];
                    const isSelected = staff.id === selectedStaffId;

                    return (
                      <div
                        key={staff.id}
                        onClick={() => setSelectedStaffId(staff.id)}
                        className={`grid grid-cols-7 min-h-[100px] cursor-pointer transition-colors ${
                          isSelected ? 'bg-primary-fixed/10' : 'hover:bg-surface-container-low/30'
                        }`}
                      >
                        {weekDays.map((day) => {
                          // Filter schedules for this staff on this day
                          const dayShifts = staffSchedules.filter(
                            (s) => s.workDate && s.workDate.startsWith(day.fullDate)
                          );

                          return (
                            <div
                              key={day.fullDate}
                              className="p-1.5 border-r border-outline-variant/20 flex flex-col gap-1.5 min-h-[100px]"
                            >
                              <div className="text-[10px] font-bold text-on-surface-variant truncate">
                                {staff.fullname}
                              </div>

                              {dayShifts.length === 0 ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalStaffId(staff.id);
                                    setModalWorkDate(day.fullDate);
                                    setIsCreateModalOpen(true);
                                  }}
                                  className="w-full h-full min-h-[50px] border border-dashed border-outline-variant/40 rounded-lg flex items-center justify-center text-outline hover:border-primary hover:text-primary transition-all group"
                                  title="Bấm để xếp ca"
                                >
                                  <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">
                                    add
                                  </span>
                                </button>
                              ) : (
                                dayShifts.map((shift) => (
                                  <div
                                    key={shift.id}
                                    className="p-1.5 rounded-lg bg-primary-container text-on-primary text-[11px] shadow-xs flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                                      {shift.startTime ? formatTimeOnly(shift.startTime) : '08:00'} - 
                                      {shift.endTime ? formatTimeOnly(shift.endTime) : '12:30'}
                                    </span>
                                    <span className="text-[10px] text-on-primary/90 truncate">Trực ca chuẩn</span>
                                  </div>
                                ))
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Inspector Column (4 Cols) */}
        <div className="xl:col-span-4 space-y-space-md">
          {/* Selected Staff Inspector */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
              <h2 className="font-title-md text-title-md font-bold text-on-surface">Chi tiết ca trực Nhân sự</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-[10px] font-bold">
                API Live
              </span>
            </div>

            {selectedStaffId && staffList.find((s) => s.id === selectedStaffId) ? (
              <div className="space-y-space-sm">
                <div className="flex items-center gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <div>
                    <h3 className="font-label-lg font-bold text-on-surface">
                      {staffList.find((s) => s.id === selectedStaffId)?.fullname}
                    </h3>
                    <p className="font-body-sm text-on-surface-variant">
                      {staffList.find((s) => s.id === selectedStaffId)?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-label-md font-bold text-on-surface">Danh sách ca trực đã gán:</h4>
                  {(schedulesMap[selectedStaffId] || []).length === 0 ? (
                    <p className="font-body-sm text-on-surface-variant italic">Chưa có ca trực nào được xếp cho nhân sự này.</p>
                  ) : (
                    (schedulesMap[selectedStaffId] || []).map((s, idx) => (
                      <div key={s.id || idx} className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                        <div>
                          <p className="font-label-md font-bold text-on-surface">
                            Ngày: {s.workDate ? formatDateOnly(s.workDate) : 'Theo lịch'}
                          </p>
                          <p className="font-body-sm text-primary">
                            Giờ: {s.startTime ? formatTimeOnly(s.startTime) : '08:00'} - {s.endTime ? formatTimeOnly(s.endTime) : '12:30'}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-tertiary">check_circle</span>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalStaffId(selectedStaffId);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary font-label-lg hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Phân ca trực mới cho nhân sự này</span>
                </button>
              </div>
            ) : (
              <p className="font-body-sm text-on-surface-variant">Vui lòng chọn một nhân sự từ bảng bên để xem chi tiết.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create Shift */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl border border-outline-variant/20 relative">
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/10">
              <h2 className="font-title-md text-title-md font-bold text-on-surface">Xếp ca trực mới</h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateScheduleSubmit} className="space-y-space-md mt-space-md">
              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Nhân sự thực hiện *</label>
                <select
                  value={modalStaffId}
                  onChange={(e) => setModalStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullname} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Ngày làm việc *</label>
                <input
                  type="date"
                  required
                  value={modalWorkDate}
                  onChange={(e) => setModalWorkDate(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Khung ca làm việc *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleShiftTypeChange('morning')}
                    className={`p-2 rounded-lg text-body-sm font-bold border transition-all ${
                      modalShiftType === 'morning'
                        ? 'bg-primary-container text-on-primary border-primary-container'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                    }`}
                  >
                    Ca Sáng<br /><span className="text-[10px] font-normal">08:00 - 12:30</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftTypeChange('afternoon')}
                    className={`p-2 rounded-lg text-body-sm font-bold border transition-all ${
                      modalShiftType === 'afternoon'
                        ? 'bg-primary-container text-on-primary border-primary-container'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                    }`}
                  >
                    Ca Chiều<br /><span className="text-[10px] font-normal">13:00 - 17:30</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShiftTypeChange('evening')}
                    className={`p-2 rounded-lg text-body-sm font-bold border transition-all ${
                      modalShiftType === 'evening'
                        ? 'bg-primary-container text-on-primary border-primary-container'
                        : 'bg-surface-container-low text-on-surface border-outline-variant/30'
                    }`}
                  >
                    Ca Tối<br /><span className="text-[10px] font-normal">17:30 - 21:00</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <label className="block font-label-lg text-on-surface">Giờ bắt đầu</label>
                  <input
                    type="time"
                    value={modalStartTime}
                    onChange={(e) => setModalStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-label-lg text-on-surface">Giờ kết thúc</label>
                  <input
                    type="time"
                    value={modalEndTime}
                    onChange={(e) => setModalEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-lg hover:bg-surface-container"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-lg hover:bg-primary shadow-sm"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Xác nhận xếp ca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
