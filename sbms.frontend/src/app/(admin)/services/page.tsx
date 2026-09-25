'use client';

import React, { useState, useEffect } from 'react';
import { serviceService } from '@/services/service.service';
import { ServiceResponse, ServiceCreateRequest, ServiceUpdateRequest } from '@/types/service.types';

export default function ServiceManagementPage() {
  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formPrice, setFormPrice] = useState<number>(500000);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Services from Backend
  const fetchServices = async (filter: 'all' | 'active' | 'inactive' = statusFilter) => {
    setLoading(true);
    try {
      let response;
      if (filter === 'active') {
        response = await serviceService.getActive();
      } else if (filter === 'inactive') {
        response = await serviceService.getInactive();
      } else {
        response = await serviceService.getAll();
      }

      if (response.statusCode === 200 && response.data) {
        setServices(response.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(statusFilter);
  }, [statusFilter]);

  // Handle Toggle Active/Inactive
  const handleToggleStatus = async (service: ServiceResponse) => {
    try {
      const updatedPayload: ServiceUpdateRequest = {
        id: service.id,
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        isActive: !service.isActive,
      };
      await serviceService.update(updatedPayload);
      fetchServices();
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormName('');
    setFormDescription('');
    setFormDuration(60);
    setFormPrice(500000);
    setFormIsActive(true);
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (service: ServiceResponse) => {
    setEditingService(service);
    setFormName(service.name);
    setFormDescription(service.description || '');
    setFormDuration(service.durationMinutes);
    setFormPrice(service.price);
    setFormIsActive(service.isActive);
    setFormError(null);
    setIsEditModalOpen(true);
  };

  // Submit Create Form
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Vui lòng nhập tên dịch vụ!');
      return;
    }
    if (formDuration <= 0) {
      setFormError('Thời lượng phải lớn hơn 0 phút!');
      return;
    }
    if (formPrice < 0) {
      setFormError('Giá dịch vụ không được âm!');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload: ServiceCreateRequest = {
        name: formName.trim(),
        description: formDescription.trim(),
        durationMinutes: Number(formDuration),
        price: Number(formPrice),
      };
      const response = await serviceService.create(payload);
      if (response.statusCode === 201 || response.statusCode === 200) {
        setIsCreateModalOpen(false);
        fetchServices();
      } else {
        setFormError(response.message || 'Tạo dịch vụ thất bại!');
      }
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo dịch vụ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (!formName.trim()) {
      setFormError('Vui lòng nhập tên dịch vụ!');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload: ServiceUpdateRequest = {
        id: editingService.id,
        name: formName.trim(),
        description: formDescription.trim(),
        durationMinutes: Number(formDuration),
        price: Number(formPrice),
        isActive: formIsActive,
      };
      const response = await serviceService.update(payload);
      if (response.statusCode === 200) {
        setIsEditModalOpen(false);
        setEditingService(null);
        fetchServices();
      } else {
        setFormError(response.message || 'Cập nhật dịch vụ thất bại!');
      }
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật dịch vụ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Services
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.isActive) ||
      (statusFilter === 'inactive' && !s.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-space-xl space-y-space-xl max-w-[1600px] mx-auto w-full">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-primary-fixed text-primary">
              <span className="material-symbols-outlined text-[22px]">spa</span>
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Quản lý Dịch vụ & Gói Liệu trình
            </h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Thiết lập danh mục dịch vụ, thời lượng thực hiện, bảng giá và trạng thái phục vụ khách hàng trên hệ thống SBMS.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            type="button"
            onClick={() => fetchServices(statusFilter)}
            className="inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-secondary hover:bg-surface-container-low hover:text-on-surface shadow-sm transition-all font-label-lg text-label-lg"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary shadow-sm hover:shadow-md transition-all font-label-lg text-label-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>Thêm dịch vụ mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg">
        {/* Card 1 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Tổng Dịch Vụ Hệ Thống
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">medical_services</span>
            </span>
          </div>
          <div className="mt-space-sm flex items-baseline gap-space-xs">
            <span className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tight">
              {services.length}
            </span>
            <span className="font-label-md text-label-md text-tertiary font-semibold">
              ({services.filter((s) => s.isActive).length} đang chạy)
            </span>
          </div>
          <div className="mt-space-xs flex items-center gap-space-xs text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="font-body-sm text-body-sm">Đồng bộ lịch đặt trực tuyến</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Dịch Vụ Phổ Biến Nhất
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </span>
          </div>
          <div className="mt-space-sm">
            <span className="font-title-md text-title-md text-on-surface font-bold truncate block">
              {services[0]?.name || 'Hydra Facial Chuyên Sâu'}
            </span>
            <div className="flex items-center gap-space-xs mt-1">
              <span className="font-label-lg text-label-lg text-primary font-bold">142 lượt đặt</span>
              <span className="inline-flex items-center font-label-sm text-label-sm text-tertiary font-semibold bg-tertiary-fixed/20 px-1.5 py-0.5 rounded">
                +18% tuần này
              </span>
            </div>
          </div>
          <div className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
            Thời lượng trung bình 60-90 phút
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Doanh Thu Dự Kiến
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {(services.reduce((acc, curr) => acc + curr.price, 0)).toLocaleString('vi-VN')}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">VNĐ</span>
            </div>
          </div>
          <div className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-tertiary text-[14px]">verified</span>
            <span>Đạt 134% chỉ tiêu tháng</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Tỷ Lệ Lấp Đầy Giường / Ca
            </span>
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">event_seat</span>
            </span>
          </div>
          <div className="mt-space-sm flex items-center justify-between">
            <span className="font-display-mobile text-display-mobile text-on-surface font-bold tracking-tight">86.4%</span>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                ></path>
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="86.4, 100"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
              </svg>
              <span className="absolute font-label-sm text-[10px] font-bold text-primary">Cao</span>
            </div>
          </div>
          <div className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
            Giãn cách tiêu chuẩn 15p khử trùng
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md border border-outline-variant/10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên dịch vụ, mô tả..."
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-md text-body-md pl-10 pr-space-md py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="appearance-none bg-surface-container-low text-on-surface font-label-lg text-label-lg pl-3 pr-8 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer transition-all"
              >
                <option value="all">Trạng thái: Tất cả</option>
                <option value="active">Đang kích hoạt (Active)</option>
                <option value="inactive">Tạm ngưng nhận khách</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold whitespace-nowrap pr-2">
            Chuyên khoa:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Tất cả ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('skincare')}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              selectedCategory === 'skincare'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Chăm sóc & Trị liệu da
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('laser')}
            className={`px-3 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
              selectedCategory === 'laser'
                ? 'bg-primary-container text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Laser & Công nghệ cao
          </button>
        </div>
      </div>

      {/* Main Services Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
        <div className="px-space-lg py-space-md flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-space-sm">
            <span className="font-title-md text-title-md font-bold text-on-surface">Danh sách Dịch vụ Trực tiếp</span>
            <span className="bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant px-2 py-0.5 rounded-full font-semibold">
              {filteredServices.length} dịch vụ
            </span>
          </div>
          <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span>Tự động kết nối .NET Backend API</span>
          </div>
        </div>

        {loading ? (
          <div className="p-space-xl text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] animate-spin text-primary mb-2">sync</span>
            <p>Đang tải danh sách dịch vụ từ hệ thống...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-space-xl text-center space-y-space-sm">
            <span className="material-symbols-outlined text-[48px] text-outline">spa</span>
            <p className="font-title-md text-on-surface">Chưa có dịch vụ nào phù hợp</p>
            <p className="font-body-sm text-on-surface-variant">
              Thêm dịch vụ mới hoặc thay đổi bộ lọc tìm kiếm để xem kết quả.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-2 inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md shadow-sm hover:bg-primary"
            >
              + Thêm dịch vụ mới
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-md text-body-md text-on-surface border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-space-sm px-space-md font-semibold">Dịch vụ & Mô tả</th>
                  <th className="py-space-sm px-space-sm font-semibold">Thời lượng / Ca</th>
                  <th className="py-space-sm px-space-sm font-semibold">Đơn giá niêm yết</th>
                  <th className="py-space-sm px-space-sm font-semibold">Trạng thái</th>
                  <th className="py-space-sm px-space-sm font-semibold text-center">Bật / Tắt</th>
                  <th className="py-space-sm px-space-md font-semibold text-right">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-space-md px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">spa</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-title-md text-label-lg font-bold text-on-surface truncate block">
                            {service.name}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                            {service.description || 'Chưa có mô tả'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-space-md px-space-sm">
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-on-surface">
                          {service.durationMinutes} phút
                        </span>
                        <span className="font-body-sm text-[11px] text-tertiary font-medium">+15p tiệt trùng</span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-sm">
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg font-bold text-primary">
                          {service.price.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="font-label-sm text-[11px] text-on-surface-variant">
                          Cọc: 30% ({(service.price * 0.3).toLocaleString('vi-VN')} đ)
                        </span>
                      </div>
                    </td>
                    <td className="py-space-md px-space-sm">
                      {service.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/40 text-error font-label-sm text-label-sm font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          Tạm ngưng
                        </span>
                      )}
                    </td>
                    <td className="py-space-md px-space-sm text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(service)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          service.isActive ? 'bg-primary-container justify-end' : 'bg-surface-container-high justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-on-primary shadow-md"></span>
                      </button>
                    </td>
                    <td className="py-space-md px-space-md text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(service)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                          title="Chỉnh sửa"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Service */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl border border-outline-variant/20 relative">
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/10">
              <h2 className="font-title-md text-title-md font-bold text-on-surface">Thêm dịch vụ mới</h2>
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

            <form onSubmit={handleCreateSubmit} className="space-y-space-md mt-space-md">
              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Hydra Facial Chuyên Sâu"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Mô tả dịch vụ</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả công dụng và các bước thực hiện..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <label className="block font-label-lg text-on-surface">Thời lượng (Phút) *</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-label-lg text-on-surface">Đơn giá (VNĐ) *</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
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
                  {isSubmitting ? 'Đang lưu...' : 'Tạo dịch vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Service */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl border border-outline-variant/20 relative">
            <div className="flex items-center justify-between pb-space-md border-b border-outline-variant/10">
              <h2 className="font-title-md text-title-md font-bold text-on-surface">Chỉnh sửa dịch vụ</h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
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

            <form onSubmit={handleEditSubmit} className="space-y-space-md mt-space-md">
              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-lg text-on-surface">Mô tả dịch vụ</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-space-md">
                <div className="space-y-1">
                  <label className="block font-label-lg text-on-surface">Thời lượng (Phút) *</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-label-lg text-on-surface">Đơn giá (VNĐ) *</label>
                  <input
                    type="number"
                    min={0}
                    step={10000}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md"
                  />
                </div>
              </div>

              <div className="flex items-center gap-space-sm pt-space-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-primary-container rounded accent-primary"
                  />
                  <span className="font-body-md text-on-surface">Kích hoạt dịch vụ này trên hệ thống</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-space-sm pt-space-md border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-lg hover:bg-surface-container"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-lg hover:bg-primary shadow-sm"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Cập nhật dịch vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
