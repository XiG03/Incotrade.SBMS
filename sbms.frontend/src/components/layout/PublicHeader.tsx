'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicHeader() {
  const pathname = usePathname();

  const isLinkActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-gutter-sm lg:px-gutter flex items-center justify-between gap-space-md">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-space-lg">
          <Link href="/" className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-lg">
              S
            </div>
            <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold">
              SBMS
            </span>
            <span className="inline-flex items-center px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
              Khách hàng
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-space-xs p-1 bg-surface-container-low rounded-xl">
            <Link
              href="/my-bookings"
              className={`px-space-md py-1.5 rounded-lg font-label-lg text-label-lg transition-colors ${
                isLinkActive('/my-bookings')
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Lịch hẹn của tôi
            </Link>
            <Link
              href="/available-slots"
              className={`px-space-md py-1.5 rounded-lg font-label-lg text-label-lg transition-colors ${
                isLinkActive('/available-slots')
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Khung giờ trống
            </Link>
          </nav>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-space-md">
          <Link
            href="/booking/step-1"
            className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Đặt lịch mới</span>
          </Link>

          <button
            type="button"
            aria-label="Thông báo"
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest" />
          </button>

          <div className="flex items-center gap-space-sm pl-space-xs border-l border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
                Nguyễn Minh Anh
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                Thành viên VIP
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[20px] hidden sm:block">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
