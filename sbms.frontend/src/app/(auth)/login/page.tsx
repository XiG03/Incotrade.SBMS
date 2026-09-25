'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { parseJwtToken } from '@/lib/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập hoặc email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await authService.login({
        username: data.username,
        password: data.password,
      });

      if (response.statusCode === 200 && response.data?.accessToken) {
        const token = response.data.accessToken;
        setAuth(token);

        const parsed = parseJwtToken(token);
        const userRole = (parsed?.role || '').toLowerCase();

        if (userRole === 'admin') {
          router.push('/services');
        } else {
          router.push('/my-bookings');
        }
      } else {
        setErrorMessage(response.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col justify-center">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md shrink-0 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-sm text-on-primary font-bold text-xl">
              SB
            </div>
            <span className="font-title-md text-title-md text-on-surface tracking-tight font-bold">SBMS</span>
          </div>
          <nav className="hidden lg:flex items-center gap-space-xs">
            <a className="px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" href="/">Trang chủ</a>
            <a className="px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" href="#">Tính năng</a>
            <a className="px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors" href="#">Bảng giá</a>
          </nav>
          <div className="flex items-center gap-space-md shrink-0">
            <a className="inline-flex items-center justify-center px-space-md py-space-sm font-label-lg text-label-lg bg-primary-container text-on-primary rounded-lg shadow-sm hover:bg-primary transition-all duration-200 active:scale-[0.98]" href="#">
              Trải nghiệm ngay
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-5rem)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-margin py-space-xl lg:py-margin-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-stretch">
            {/* Left Column: Form */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center">
              <div className="bg-surface-container-lowest rounded-xl p-space-lg sm:p-margin shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  {/* Form Header */}
                  <div className="flex items-center gap-space-sm mb-space-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-on-primary text-[24px]">event_available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md text-on-surface font-bold tracking-tight">SBMS</span>
                      <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    </div>
                    <span className="ml-auto px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
                      B2B Portal
                    </span>
                  </div>

                  <div className="space-y-space-xs mb-space-xl">
                    <h1 className="font-headline-md text-headline-md text-on-surface">Chào mừng trở lại</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Đăng nhập để quản lý lịch hẹn, nhân sự và tối ưu hóa vận hành dịch vụ.
                    </p>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-body-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form className="space-y-space-md" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username */}
                    <div className="space-y-space-xs">
                      <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="usernameInput">
                        Tên đăng nhập hoặc Email
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-secondary pointer-events-none text-[20px]">
                          account_circle
                        </span>
                        <input
                          {...register('username')}
                          className="w-full pl-11 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                          id="usernameInput"
                          placeholder="admin@sbms.vn hoặc tên tài khoản"
                          type="text"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-error text-body-sm mt-1">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="passwordInput">
                          Mật khẩu
                        </label>
                        <a className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors" href="#">
                          Quên mật khẩu?
                        </a>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-secondary pointer-events-none text-[20px]">
                          lock
                        </span>
                        <input
                          {...register('password')}
                          className="w-full pl-11 pr-11 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                          id="passwordInput"
                          placeholder="••••••••"
                          type={showPassword ? 'text' : 'password'}
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 p-1 text-secondary hover:text-on-surface transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Ẩn hoặc hiện mật khẩu"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-error text-body-sm mt-1">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-between pt-space-xs">
                      <label className="flex items-center gap-space-sm cursor-pointer select-none">
                        <input
                          {...register('rememberMe')}
                          className="w-4 h-4 rounded text-primary-container bg-surface-container-low accent-primary cursor-pointer"
                          type="checkbox"
                        />
                        <span className="font-body-md text-body-md text-on-surface-variant">Ghi nhớ đăng nhập 30 ngày</span>
                      </label>
                      <span className="inline-flex items-center gap-1 text-tertiary font-label-sm text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                        Trực tuyến
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-space-sm py-3 px-space-lg rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary transition-all duration-200 active:scale-[0.99] mt-space-md disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <span>Đang xử lý...</span>
                      ) : (
                        <>
                          <span>Đăng nhập vào hệ thống</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* SSO Divider */}
                  <div className="relative my-space-lg">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-surface-container-high"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-surface-container-lowest px-space-md font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                        Hoặc đăng nhập nhanh qua
                      </span>
                    </div>
                  </div>

                  {/* SSO Buttons */}
                  <div className="grid grid-cols-2 gap-space-md">
                    <button type="button" className="flex items-center justify-center gap-space-sm py-2.5 px-space-md rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors shadow-sm">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                      </svg>
                      <span>Google</span>
                    </button>
                    <button type="button" className="flex items-center justify-center gap-space-sm py-2.5 px-space-md rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors shadow-sm">
                      <div className="w-4 h-4 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-[10px]">
                        Z
                      </div>
                      <span>Zalo OA</span>
                    </button>
                  </div>
                </div>

                <div className="mt-space-xl pt-space-lg space-y-space-md">
                  <p className="text-center font-body-md text-body-md text-on-surface-variant">
                    Chưa có tài khoản cơ sở kinh doanh?{' '}
                    <a className="font-label-lg text-label-lg text-primary hover:text-primary-container font-semibold transition-colors" href="#">
                      Đăng ký dùng thử 14 ngày
                    </a>
                  </p>
                  <div className="flex items-center justify-center gap-space-md py-space-xs px-space-md bg-surface rounded-lg">
                    <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                      Mã hóa SSL 256-bit
                    </span>
                    <span className="text-outline-variant">•</span>
                    <span className="flex items-center gap-1.5 font-label-sm text-label-sm text-secondary">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                      Bảo mật ISO/IEC 27001
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
              <div className="h-full bg-gradient-to-br from-surface-container-low via-surface-container to-surface-variant rounded-xl p-space-lg sm:p-margin lg:p-margin-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>
                <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-tertiary/10 blur-xl pointer-events-none"></div>

                <div className="relative z-10 space-y-space-sm">
                  <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    <span className="font-label-sm text-label-sm text-on-surface">Trung tâm điều hành lịch hẹn 24/7</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight max-w-lg">
                    Kiểm soát lịch đặt hẹn chuẩn xác, không còn trùng lặp.
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    Hệ thống tự động đồng bộ hóa khung giờ khả dụng theo thời gian thực và thông báo tức thì đến khách hàng.
                  </p>
                </div>

                <div className="relative z-10 my-space-lg space-y-space-md">
                  <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md">
                    <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                        </div>
                        <div>
                          <h3 className="font-label-lg text-label-lg text-on-surface">Công suất ca phục vụ hôm nay</h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Cập nhật lúc 09:30 AM</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                        88% Kín chỗ
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                        <span>28/32 slots đã chốt cọc</span>
                        <span className="font-bold text-primary">Còn trống 4 ca</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full w-[88%] transition-all duration-500"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-space-xs mt-space-md pt-space-xs">
                      <div className="p-2 rounded bg-surface-container-low text-center">
                        <p className="font-label-sm text-label-sm text-secondary">10:00</p>
                        <p className="font-label-sm text-label-sm text-primary font-bold">VIP 1</p>
                      </div>
                      <div className="p-2 rounded bg-surface-container-low text-center">
                        <p className="font-label-sm text-label-sm text-secondary">11:30</p>
                        <p className="font-label-sm text-label-sm text-primary font-bold">Gội đầu</p>
                      </div>
                      <div className="p-2 rounded bg-surface-container-low text-center">
                        <p className="font-label-sm text-label-sm text-secondary">14:00</p>
                        <p className="font-label-sm text-label-sm text-primary font-bold">Laser</p>
                      </div>
                      <div className="p-2 rounded bg-surface-container-high text-center">
                        <p className="font-label-sm text-label-sm text-primary">16:30</p>
                        <p className="font-label-sm text-label-sm text-tertiary font-bold">Trống</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-space-md shadow-sm flex items-start gap-space-md">
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">mark_chat_read</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-label-lg text-label-lg text-on-surface truncate">Thông báo Zalo ZNS Tự Động</p>
                        <span className="font-label-sm text-label-sm text-secondary shrink-0">Vừa xong</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-1">
                        Đã gửi nhắc hẹn đến khách hàng <strong className="text-on-surface">Trần Phương Linh</strong> (Ca 14:00 hôm nay). Tỷ lệ phản hồi 94.2%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-space-sm mb-space-xs">
                    <div className="flex text-amber-500">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Giảm 80% hủy hẹn</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic mb-space-sm">
                    “Từ ngày áp dụng SBMS, phòng khám của chúng tôi tối ưu 100% lịch trống của bác sĩ. Khách hàng nhận tin nhắc qua Zalo rất chuyên nghiệp và đến đúng giờ.”
                  </p>
                  <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-label-sm">
                      ML
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface leading-tight">Chị Mai Lan</p>
                      <p className="font-body-sm text-body-sm text-secondary">Founder &amp; CEO tại May Clinic Beauty</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
