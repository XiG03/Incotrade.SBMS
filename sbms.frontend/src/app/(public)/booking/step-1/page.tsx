'use client';

import { useRouter } from 'next/navigation';
import { useActiveServices } from '@/hooks/useServices';
import { useAllStaffs } from '@/hooks/useStaffs';
import { useBookingStore } from '@/store/bookingStore';

export default function BookingStep1Page() {
  const router = useRouter();
  const { data: servicesRes, isLoading: loadingServices } = useActiveServices();
  const { data: staffsRes, isLoading: loadingStaffs } = useAllStaffs();

  const {
    selectedService,
    selectedStaff,
    setSelectedService,
    setSelectedStaff,
    setStep,
  } = useBookingStore();

  const services = servicesRes?.data || [
    {
      id: 'srv-demo-1',
      name: 'Lấy cao răng & Thăm khám tổng quát',
      description: 'Chăm sóc răng miệng chuyên sâu 6 bước chuẩn y khoa',
      price: 500000,
      durationMinutes: 60,
      isActive: true,
    },
    {
      id: 'srv-demo-2',
      name: 'Chăm sóc da Hydra chuyên sâu',
      description: 'Cấp ẩm và phục hồi da nhạy cảm bằng công nghệ tế bào gốc',
      price: 850000,
      durationMinutes: 75,
      isActive: true,
    },
    {
      id: 'srv-demo-3',
      name: 'Khám da liễu & Phục hồi da',
      description: 'Thăm khám 1:1 cùng Bác sĩ Chuyên khoa Da liễu',
      price: 600000,
      durationMinutes: 45,
      isActive: true,
    },
  ];

  const staffs = staffsRes?.data || [
    {
      id: 'staff-demo-1',
      fullName: 'BS. Hoàng Nam',
      email: 'nam.hoang@sbms.vn',
      phoneNumber: '0901234567',
      role: 'Chuyên gia Chăm sóc Răng Hàm Mặt',
      isActive: true,
    },
    {
      id: 'staff-demo-2',
      fullName: 'CV. Thu Thảo',
      email: 'thao.thu@sbms.vn',
      phoneNumber: '0907654321',
      role: 'Kỹ thuật viên Da liễu Cao cấp',
      isActive: true,
    },
    {
      id: 'staff-demo-3',
      fullName: 'BS. Lan Hương',
      email: 'huong.lan@sbms.vn',
      phoneNumber: '0912345678',
      role: 'Bác sĩ Chuyên khoa II Da liễu',
      isActive: true,
    },
  ];

  const handleNext = () => {
    if (!selectedService) return;
    setStep(2);
    router.push('/booking/step-2');
  };

  return (
    <div className="w-full py-space-lg px-gutter-sm lg:px-gutter max-w-7xl mx-auto flex flex-col gap-space-lg">
      {/* Stepper Progress */}
      <div className="p-space-md lg:p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="grid grid-cols-3 gap-space-md">
          {/* Step 1 (Active) */}
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Bước 1</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate block">
                Chọn Dịch vụ & Chuyên gia
              </span>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex items-center gap-space-sm opacity-50">
            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              2
            </div>
            <div className="min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Bước 2</span>
              <span className="font-label-md text-label-md text-on-surface truncate block">Chọn Ngày & Giờ</span>
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
          Bước 1: Chọn Dịch vụ & Chuyên viên phụ trách
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Vui lòng chọn dịch vụ bạn mong muốn sử dụng và chuyên gia phục vụ (nếu có yêu cầu riêng).
        </p>
      </div>

      {/* Services List */}
      <div className="flex flex-col gap-space-md">
        <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">spa</span>
          Danh sách Dịch vụ khả dụng
        </h2>

        {loadingServices ? (
          <div className="py-8 text-center text-on-surface-variant animate-pulse">
            Đang tải danh sách dịch vụ...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {services.map((service: any) => {
              const isSelected = selectedService?.id === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-space-lg rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-space-md ${
                    isSelected
                      ? 'border-primary bg-primary-fixed/20 shadow-md ring-2 ring-primary/20'
                      : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                        {service.durationMinutes || 60} phút
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-[24px]">
                          check_circle
                        </span>
                      )}
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold mt-1">
                      {service.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {(service.price || 500000).toLocaleString('vi-VN')} đ
                    </span>
                    <span className="font-label-md text-label-md text-primary hover:underline font-semibold">
                      {isSelected ? 'Đã chọn' : 'Chọn dịch vụ'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Staff Selection */}
      <div className="flex flex-col gap-space-md pt-space-md">
        <h2 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Chọn Chuyên gia / Kỹ thuật viên (Tùy chọn)
        </h2>

        {loadingStaffs ? (
          <div className="py-8 text-center text-on-surface-variant animate-pulse">
            Đang tải danh sách chuyên gia...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Any Available Staff option */}
            <div
              onClick={() => setSelectedStaff(null)}
              className={`p-space-md rounded-xl border-2 transition-all cursor-pointer flex items-center gap-space-md ${
                selectedStaff === null
                  ? 'border-primary bg-primary-fixed/20 shadow-md'
                  : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">
                  Tự động xếp chuyên gia
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Hệ thống chọn người phù hợp nhất
                </span>
              </div>
            </div>

            {staffs.map((staff: any) => {
              const isSelected = selectedStaff?.id === staff.id;
              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`p-space-md rounded-xl border-2 transition-all cursor-pointer flex items-center gap-space-md ${
                    isSelected
                      ? 'border-primary bg-primary-fixed/20 shadow-md ring-2 ring-primary/20'
                      : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                    {(staff.fullName || staff.fullname || 'S').charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                      {staff.fullName || staff.fullname || 'Chuyên viên'}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {staff.role || 'Chuyên viên SBMS'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-end pt-space-lg">
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedService}
          className="px-6 py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-primary-container disabled:opacity-50 transition-all font-bold flex items-center gap-2"
        >
          <span>Tiếp tục: Chọn ngày & giờ</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
