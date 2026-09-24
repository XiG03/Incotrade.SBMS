'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { label: 'Quản lý booking', path: '/bookings', icon: 'calendar_month', badge: '14' },
    { label: 'Quản lý dịch vụ', path: '/services', icon: 'spa' },
    { label: 'Quản lý lịch/ca làm', path: '/schedules', icon: 'schedule' },
    { label: 'Tổng quan / Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Nhân viên & KTV', path: '/staffs', icon: 'badge' },
    { label: 'Báo cáo & Doanh thu', path: '/reports', icon: 'query_stats' },
    { label: 'Cài đặt hệ thống', path: '/settings', icon: 'tune' },
  ];

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center gap-space-sm border-b border-outline-variant/10">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-lg shadow-sm">
              SB
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md font-bold tracking-tight text-on-surface">SBMS</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="px-space-md py-space-sm">
            <div className="bg-surface-container-low px-space-md py-space-sm rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
                </span>
                <span className="font-label-md text-label-md text-on-surface font-medium">Hệ thống sẵn sàng</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary font-semibold uppercase">Online</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-space-md py-space-sm space-y-space-xs">
            <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Quản lý chính
            </div>
            {navLinks.slice(0, 3).map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    <span className="font-label-lg text-label-lg">{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`font-label-sm text-label-sm px-space-sm py-0.5 rounded-full ${
                        isActive ? 'bg-on-primary text-primary font-bold' : 'bg-primary-container text-on-primary'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-space-md px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
              Tổng quan & Cấu hình
            </div>
            {navLinks.slice(3).map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                  <span className="font-label-lg text-label-lg">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-space-md bg-surface-container-lowest border-t border-outline-variant/10">
          <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Phiên bản</span>
              <span className="font-label-sm text-label-sm font-semibold text-primary bg-primary-fixed px-space-xs py-0.5 rounded">
                v2.4 Pro
              </span>
            </div>
            <div className="flex items-center gap-space-xs pt-space-xs text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-tertiary">headset_mic</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Hotline hỗ trợ 24/7</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">1900 6868</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72 flex-1 flex flex-col min-w-0">
        {/* Header with Admin Info */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/10">
          <div className="h-16 w-full px-space-xl flex items-center justify-between gap-space-lg">
            {/* Left Branch & Search */}
            <div className="flex items-center gap-space-md flex-1 max-w-xl">
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-lg text-on-surface cursor-pointer hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Chi nhánh</span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">Chi nhánh Quận 3</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant ml-space-xs">expand_more</span>
              </div>
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm mã booking, dịch vụ, khách hàng..."
                  className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm pl-9 pr-space-md py-space-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                />
              </div>
            </div>

            {/* Right Admin Profile & Quick Actions */}
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-space-sm">
                <button
                  type="button"
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                  aria-label="Thông báo"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-error text-on-error font-label-sm text-[10px] flex items-center justify-center rounded-full leading-none font-bold">
                    5
                  </span>
                </button>
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all"
                  aria-label="Cài đặt"
                >
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>
              </div>

              <div className="h-6 w-px bg-outline-variant/40"></div>

              {/* Admin Profile Box */}
              <div className="relative">
                <div
                  className="flex items-center gap-space-sm cursor-pointer p-1.5 rounded-lg hover:bg-surface-container-low transition-colors"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  <div className="flex flex-col text-right">
                    <span className="font-label-md text-label-md font-bold text-on-surface">Trần Quản Trị</span>
                    <span className="font-label-sm text-label-sm text-primary font-medium">Quản lý vận hành hệ thống</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
                </div>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-2 z-50">
                    <div className="px-4 py-2 border-b border-outline-variant/10">
                      <p className="font-label-md font-bold text-on-surface">Trần Quản Trị</p>
                      <p className="font-body-sm text-on-surface-variant truncate">admin@sbms.vn</p>
                    </div>
                    <a href="#profile" className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      <span>Hồ sơ cá nhân</span>
                    </a>
                    <a href="#security" className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors">
                      <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                      <span>Đổi mật khẩu</span>
                    </a>
                    <div className="my-1 border-t border-outline-variant/10"></div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 font-label-md text-error hover:bg-error-container/20 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-16 w-full flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
