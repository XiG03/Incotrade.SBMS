# 🚀 SBMS - Service & Booking Management System (Demo Guide)

Hệ thống Quản lý Dịch vụ & Đặt Lịch Hẹn (SBMS) được thiết kế hiện đại với kiến trúc **Frontend (Next.js 14 App Router, TypeScript, TailwindCSS)** kết hợp **Backend (ASP.NET Core Web API 8.0)**.

Tài liệu này hướng dẫn chi tiết cách cài đặt, **cấu hình database**, **chạy migration**, **seed dữ liệu mẫu** và quy trình từng bước để kiểm thử (test demo) toàn bộ các tính năng.

---

## ⚙️ 1. Cấu Hình Database (Database Configuration)

### 1.1 Chuẩn bị file cấu hình `appsettings.json`

File cấu hình mẫu đã được cung cấp tại [`sbms.backend/appsettings.example.json`](sbms.backend/appsettings.example.json).

1. **Copy** file mẫu thành `appsettings.json`:
   ```bash
   cd sbms.backend
   copy appsettings.example.json appsettings.json
   ```
   *(Trên Linux/macOS: `cp appsettings.example.json appsettings.json`)*

2. **Mở file `appsettings.json`** và chỉnh sửa chuỗi kết nối theo môi trường của bạn:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=TÊN_MÁY_CHỦ\\SQLEXPRESS;Database=SBMST;Trusted_Connection=True;TrustServerCertificate=True;"
   }
   ```

   Các trường hợp kết nối phổ biến:

   | Loại cài đặt | Connection String |
   | :--- | :--- |
   | **SQL Server Express cục bộ** (khuyến nghị) | `Server=.\SQLEXPRESS;Database=SBMST;Trusted_Connection=True;TrustServerCertificate=True;` |
   | **SQL Server LocalDB** | `Server=(localdb)\\mssqllocaldb;Database=SBMST;Trusted_Connection=True;` |
   | **SQL Server với User/Password** | `Server=localhost;Database=SBMST;User Id=sa;Password=YourPassword123;TrustServerCertificate=True;` |
   | **Tên máy cụ thể** (như máy gốc `MSI\SQLEXPRESS`) | `Server=MSI\\SQLEXPRESS;Database=SBMST;Trusted_Connection=True;TrustServerCertificate=True;` |

   > **Lưu ý:** Thay `TÊN_MÁY_CHỦ` bằng tên máy tính thực tế của bạn (xem trong SQL Server Management Studio).

3. **Giữ nguyên cấu hình JWT** — các giá trị mặc định đã được cài sẵn và phù hợp cho môi trường demo:
   ```json
   "Jwt": {
     "Key": "THIS_IS_MY_SUPER_SECRET_KEY_FOR_JWT_TOKEN_GENERATION_1234567890_ABCDEF",
     "Issuer": "MyAwesomeApp",
     "Audience": "MyAwesomeAudience"
   }
   ```

---

## 🗄️ 2. Chạy Migration & Tạo Database

> **Yêu cầu:** Đã cài đặt **EF Core CLI** (`dotnet-ef`). Nếu chưa có, chạy:
> ```bash
> dotnet tool install --global dotnet-ef
> ```

1. Di chuyển vào thư mục backend:
   ```bash
   cd sbms.backend
   ```

2. **Áp dụng migration** để tạo cấu trúc bảng trong SQL Server:
   ```bash
   dotnet ef database update
   ```
   Lệnh này sẽ tự động tạo database `SBMST` (nếu chưa tồn tại) và tạo toàn bộ các bảng:
   `AppUsers`, `Customers`, `Staffs`, `Services`, `Bookings`, `WorkSchedules`, `RefreshTokens`.

3. *(Tùy chọn)* Xem danh sách các migration hiện có:
   ```bash
   dotnet ef migrations list
   ```

---

## 🌱 3. Chạy Script Sinh Dữ Liệu Mẫu (Seed Data)

File script SQL đã được chuẩn bị sẵn tại [`sbms.backend/seed_data.sql`](sbms.backend/seed_data.sql).

Script bao gồm:
- **1 tài khoản Admin** (`admin` / `Demo@123456`)
- **2 tài khoản Customer** (`nguyenthianh` và `tranminhduc`, cùng mật khẩu `Demo@123456`)
- **2 nhân viên / chuyên viên** (BS. Lê Thùy Linh, KTV. Trần Thu Thảo)
- **6 ca làm việc** (WorkSchedule) phân bổ trong tuần tới
- **5 dịch vụ** (Hydra Facial, Lấy cao răng, Massage đá nóng, Điều trị mụn, Phục hồi tóc Keratin)
- **5 booking** với đầy đủ 3 trạng thái: `Pending`, `Confirmed`, `Completed`, `Cancelled`

### Cách thực thi script:

**Cách 1 — SQL Server Management Studio (SSMS):**
1. Mở SSMS, kết nối vào SQL Server của bạn.
2. Chọn database `SBMST` (đã tạo ở bước Migration).
3. Mở file `sbms.backend/seed_data.sql` → bấm **Execute (F5)**.

**Cách 2 — sqlcmd (Command Line):**
```bash
sqlcmd -S .\SQLEXPRESS -d SBMST -i sbms.backend/seed_data.sql
```
*(Thay `.\SQLEXPRESS` bằng tên SQL Server của bạn nếu khác)*

**Cách 3 — Azure Data Studio:**
1. Kết nối database `SBMST`.
2. Mở file `seed_data.sql` → bấm **Run**.

> **Lưu ý về mật khẩu:** Script sử dụng BCrypt hash sẵn. Mật khẩu đăng nhập mặc định của **tất cả tài khoản** là: **`Demo@123456`**

---

## 🚀 4. Khởi Chạy Hệ Thống

### 4.1 Backend (`sbms.backend`)
```bash
cd sbms.backend
dotnet run
```
Backend chạy tại: `http://localhost:5130`

### 4.2 Frontend (`sbms.frontend`)
1. Yêu cầu: **Node.js 18+** & **npm**.
2. Mở Terminal mới:
   ```bash
   cd sbms.frontend
   npm install
   npm run dev
   ```
3. Frontend chạy tại: `http://localhost:3000`.

## 🔐 5. Phân Quyền Vai Trò & Đăng Nhập (Role & Auth Flow)

Hệ thống phân chia 2 vai trò người dùng chính dựa trên **JWT AccessToken**:

| Vai trò (Role) | Chức năng chính | Trang điều hướng mặc định |
| :--- | :--- | :--- |
| **Customer** (Khách hàng) | Đặt lịch mới, tra cứu slot trống, xem & hủy lịch hẹn cá nhân | `/my-bookings` |
| **Admin** (Quản trị viên) | Quản lý toàn bộ booking, cập nhật trạng thái, quản lý dịch vụ & ca làm việc | `/bookings` (hoặc `/services`) |

### 🚀 Cách kiểm thử Đăng nhập & Guard Bảo vệ Route:
1. Truy cập trang Đăng nhập: `http://localhost:3000/login`
2. **Test Đăng nhập Customer**:
   - Nhập tài khoản Customer. Sau khi thành công, hệ thống lưu token vào `localStorage` và tự động chuyển hướng đến `/my-bookings`.
   - **Thử nghiệm Bảo mật**: Khi đang là Customer, nếu cố tình nhập URL trang Admin (ví dụ: `http://localhost:3000/bookings` hoặc `http://localhost:3000/services`), hệ thống Guard tại Admin Layout sẽ phát hiện role không hợp lệ và **tự động đẩy ngược về trang `/my-bookings`**.
3. **Test Đăng nhập Admin**:
   - Đăng xuất và đăng nhập bằng tài khoản Admin. Hệ thống tự động chuyển hướng vào Trang Quản trị `/bookings`.

---

## 📋 6. Quy Trình Test Các Kịch Bản Demo (Step-by-Step Test Scenarios)

### Kịch bản 1: Tra Cứu Khung Giờ Trống Tách Biệt (`/available-slots`)
- **Đường dẫn**: `http://localhost:3000/available-slots`
- **Mục đích**: Giúp khách hàng hoặc tư vấn viên tra cứu khung giờ trống của chuyên viên/dịch vụ độc lập mà không cần đi qua luồng đặt lịch.
- **Thao tác test**:
  1. Chọn **Dịch vụ** hoặc **Chuyên viên** và chọn **Ngày**.
  2. Bấm **Tìm khung giờ trống**.
  3. **Xử lý trường hợp 404 (Không có slot)**: Nếu API trả về 404 NotFound (hoặc chưa có lịch), giao diện sẽ hiển thị thông báo dịu mắt, gợi ý người dùng chọn ngày khác hoặc chọn chuyên viên khác thay vì báo lỗi ứng dụng.

---

### Kịch bản 2: Luồng Đặt Lịch Hẹn Mới Dành Cho Khách Hàng (Booking Flow)

Luồng đặt lịch trải qua **3 bước chuẩn hóa (Stepper UI)**:

1. **Bước 1: Chọn Dịch vụ & Chuyên viên** (`/booking/step-1`)
   - Chọn Dịch vụ chăm sóc/khám bệnh mong muốn.
   - Chọn Chuyên viên / Bác sĩ phụ trách.
   - Bấm **Tiếp tục sang Bước 2**.

2. **Bước 2: Chọn Ngày & Khung Giờ** (`/booking/step-2`)
   - Chọn Ngày trên lịch.
   - Chọn Khung giờ khả dụng (được fetch từ API `/api/Bookings/available-slots`).
   - Bấm **Tiếp tục sang Bước 3**.

3. **Bước 3: Điền Thông Tin Cá Nhân & Ghi Chú** (`/booking/step-3`)
   - Nhập Họ tên, Số điện thoại, Email và Ghi chú (nếu có).
   - Kiểm tra lại Bảng Tóm tắt Thông tin Đặt lịch ở cột bên phải.
   - Bấm **Xác nhận Đặt lịch**.

4. **Trang Hoàn Tất Đặt Lịch** (`/booking/confirmation`)
   - Màn hình hiển thị thông báo Đặt lịch Thành công.
   - Hiển thị **Mã Booking** (ví dụ: `#BK-8821`) và **Mã QR Code Check-in**.
   - Có nút đồng bộ lịch Google Calendar / iCal và nút di chuyển nhanh tới **Lịch hẹn của tôi**.

---

### Kịch bản 3: Khách Hàng Quản Lý Lịch Hẹn Cá Nhân (`/my-bookings`)
- **Đường dẫn**: `http://localhost:3000/my-bookings`
- **Thao tác test**:
  1. **Xem danh sách**: Hiển thị danh sách các booking cá nhân dưới dạng thẻ/card kèm nhãn trạng thái trực quan (`Chờ duyệt`, `Đã xác nhận`, `Đã xong`, `Đã hủy`).
  2. **Bộ lọc trạng thái & Tìm kiếm**:
     - Bấm chuyển các tab trạng thái: *Tất cả*, *Chờ xác nhận*, *Đã xác nhận*, *Đã hoàn thành*, *Đã hủy*.
     - Gõ mã booking hoặc tên dịch vụ vào thanh tìm kiếm để lọc nhanh.
  3. **Hủy lịch hẹn**:
     - Bấm nút **Hủy lịch** ở một booking `Pending` hoặc `Confirmed`.
     - Hộp thoại Modal hiện ra yêu cầu nhập **Lý do hủy**.
     - Bấm **Xác nhận Hủy** -> API `POST /api/Bookings/{id}/cancel` được gọi, danh sách tự động refetch và cập nhật nhãn thành `Đã hủy`.

---

### Kịch bản 4: Quản Trị Viên Quản Lý Booking Toàn Hệ Thống (`(admin)/bookings`)
- **Đường dẫn**: `http://localhost:3000/bookings` (Yêu cầu đăng nhập Admin)
- **Thao tác test**:
  1. **Xem Tổng quan Thống kê KPI**:
     - Thẻ thống kê: *Tổng booking*, *Chờ duyệt*, *Đã xác nhận*, *Đã hoàn thành*.
  2. **Chuyển đổi Chế độ xem (View Mode)**:
     - Chuyển đổi giữa dạng **Bảng dữ liệu (Table View)** chi tiết và dạng **Thẻ hiển thị (Grid Cards View)**.
  3. **Cập nhật Trạng thái Booking (PATCH API)**:
     - Tại từng dòng/thẻ booking:
       - Bấm **Duyệt** (`Pending` ➔ `Confirmed`): Xác nhận giữ chỗ cho khách.
       - Bấm **Xong** (`Confirmed` ➔ `Completed`): Đánh dấu hoàn tất ca dịch vụ.
       - Bấm **Hủy** (`Cancelled`): Hủy cuộc hẹn.
     - Quan sát nút thao tác chuyển sang trạng thái loading spinner và cập nhật nhãn ngay lập tức khi API phản hồi.
  4. **Popup Xem Chi Tiết**:
     - Bấm nút **Chi tiết** tại bất kỳ booking nào để mở Popup Modal hiển thị đầy đủ thông tin khách hàng, ghi chú, chuyên viên và bộ công cụ đổi trạng thái trực tiếp.

---

### Kịch bản 5: Quản Lý Dịch Vụ & Lịch Ca Làm Việc Admin

1. **Quản lý Dịch vụ (`/services`)**:
   - Lọc dịch vụ theo danh mục (Nha khoa, Da liễu, Spa, Chăm sóc tóc...).
   - Thêm dịch vụ mới, chỉnh sửa giá tiền & thời lượng, hoặc kích hoạt/tắt trạng thái dịch vụ.

2. **Quản lý Lịch / Ca làm việc (`/schedules`)**:
   - Phân ca làm việc cho nhân viên theo từng ngày trong tuần.
   - Quản lý trạng thái hoạt động của từng ca.

---

## ⚙️ 7. Cấu Trúc Thư Mục Dự Án (Folder Structure)

```text
Incotrade.Test/
├── sbms.backend/                 # Source code ASP.NET Core Web API
│   ├── Modules/
│   │   ├── Auth/                 # Controllers & Services Authentication
│   │   ├── Booking/              # BookingsController, DTOs, Services
│   │   ├── Service/              # ServicesController, Service Management
│   │   └── Staff/                # Staff & Schedule Controllers
│   └── Helpers/                  # APIResponse, PagedResponse wrappers
│
├── sbms.frontend/                # Source code Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/          # Route Group Admin (Layout kiểm tra Auth Guard)
│   │   │   │   ├── bookings/     # Trang quản lý Booking Admin
│   │   │   │   ├── services/     # Trang quản lý Dịch vụ
│   │   │   │   └── schedules/    # Trang quản lý Lịch làm việc
│   │   │   ├── (auth)/
│   │   │   │   └── login/        # Trang Đăng nhập phân quyền Role
│   │   │   └── (public)/
│   │   │       ├── booking/      # Luồng Đặt lịch 3 bước + Confirmation
│   │   │       ├── available-slots/ # Trang tra cứu slot trống tách biệt
│   │   │       └── my-bookings/  # Trang Lịch hẹn của tôi (Customer)
│   │   ├── components/           # UI Components (Header, Footer, QueryProvider)
│   │   ├── hooks/                # Custom React Query Hooks (useBookings, useServices...)
│   │   ├── services/             # Axios API Services (booking.service, auth.service...)
│   │   ├── store/                # Zustand Auth Store (token, role)
│   │   └── types/                # TypeScript Interfaces & DTOs
│   └── package.json
└── README.md                     # File hướng dẫn chạy & test demo
```

---

## ✅ 8. Tổng Kết & Danh Sách API Đã Tích Hợp

| Module | Endpoint Backend | Method | Tương ứng ở Frontend |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/Auth/login` | `POST` | `authService.login()` |
| **Booking** | `/api/Bookings/my-bookings` | `GET` | `useMyBookings()` |
| **Booking** | `/api/Bookings/available-slots` | `GET` | `useAvailableSlots()` |
| **Booking** | `/api/Bookings` | `POST` | `useCreateBooking()` |
| **Booking** | `/api/Bookings/{id}/cancel` | `POST` | `useCancelBooking()` |
| **Admin Booking** | `/api/Bookings` | `GET` | `useAllBookings()` |
| **Admin Booking** | `/api/Bookings/{id}/status` | `PATCH` | `useUpdateBookingStatus()` |