-- ============================================================
-- SBMS - Seed Data Script (SQL Server)
-- Chạy sau khi đã migrate xong database
-- Mật khẩu mặc định tất cả tài khoản: Demo@123456
-- BCrypt hash của "Demo@123456"
-- ============================================================

-- =======================
-- 1. AppUsers (tài khoản đăng nhập)
-- =======================
-- 1 Admin, 2 Customer
INSERT INTO AppUsers (Id, UserName, Email, Password, IsActive, Role)
VALUES
  -- Admin
  ('11111111-0000-0000-0000-000000000001',
   'admin',
   'admin@sbms.vn',
   'Demo@123456',
   1,
   'Admin'),

  -- Customer 1
  ('22222222-0000-0000-0000-000000000001',
   'nguyenthianh',
   'thianh@gmail.com',
   'Demo@123456',
   1,
   'Customer'),

  -- Customer 2
  ('22222222-0000-0000-0000-000000000002',
   'tranminhduc',
   'minhduc@gmail.com',
   'Demo@123456',
   1,
   'Customer');

-- =======================
-- 2. Customers (hồ sơ khách hàng)
-- =======================
INSERT INTO Customers (Id, UserId, FullName, Email, PhoneNumber, DateOfBirth)
VALUES
  ('33333333-0000-0000-0000-000000000001',
   '22222222-0000-0000-0000-000000000001',
   N'Nguyễn Thị Anh',
   'thianh@gmail.com',
   '0901234567',
   '1995-06-15'),

  ('33333333-0000-0000-0000-000000000002',
   '22222222-0000-0000-0000-000000000002',
   N'Trần Minh Đức',
   'minhduc@gmail.com',
   '0912345678',
   '1990-11-22');

-- =======================
-- 3. Staffs (nhân viên / chuyên viên)
-- =======================
INSERT INTO Staffs (Id, FullName, Email, IsActive)
VALUES
  ('44444444-0000-0000-0000-000000000001',
   N'BS. Lê Thùy Linh',
   'thuylinh@sbms.vn',
   1),

  ('44444444-0000-0000-0000-000000000002',
   N'KTV. Trần Thu Thảo',
   'thuthao@sbms.vn',
   1);

-- =======================
-- 4. WorkSchedules (lịch làm việc nhân viên)
-- (Mỗi nhân viên có 3 ca trong tuần tới)
-- =======================
INSERT INTO WorkSchedules (Id, StaffId, WorkDate, StartTime, EndTime)
VALUES
  -- BS. Lê Thùy Linh
  ('55555555-0000-0000-0000-000000000001',
   '44444444-0000-0000-0000-000000000001',
   '2026-09-26', '2026-09-26 08:00:00', '2026-09-26 12:00:00'),

  ('55555555-0000-0000-0000-000000000002',
   '44444444-0000-0000-0000-000000000001',
   '2026-09-27', '2026-09-27 08:00:00', '2026-09-27 17:00:00'),

  ('55555555-0000-0000-0000-000000000003',
   '44444444-0000-0000-0000-000000000001',
   '2026-09-29', '2026-09-29 13:00:00', '2026-09-29 17:00:00'),

  -- KTV. Trần Thu Thảo
  ('55555555-0000-0000-0000-000000000004',
   '44444444-0000-0000-0000-000000000002',
   '2026-09-26', '2026-09-26 09:00:00', '2026-09-26 17:00:00'),

  ('55555555-0000-0000-0000-000000000005',
   '44444444-0000-0000-0000-000000000002',
   '2026-09-28', '2026-09-28 08:00:00', '2026-09-28 12:00:00'),

  ('55555555-0000-0000-0000-000000000006',
   '44444444-0000-0000-0000-000000000002',
   '2026-09-30', '2026-09-30 09:00:00', '2026-09-30 17:00:00');

-- =======================
-- 5. Services (dịch vụ)
-- =======================
INSERT INTO Services (Id, Name, Description, DurationMinutes, Price, IsActive)
VALUES
  ('66666666-0000-0000-0000-000000000001',
   N'Hydra Facial Chuyên Sâu',
   N'Làm sạch sâu và cấp ẩm chuyên nghiệp, phục hồi độ ẩm tự nhiên cho da, thích hợp cho mọi loại da.',
   90, 650000, 1),

  ('66666666-0000-0000-0000-000000000002',
   N'Lấy Cao Răng & Đánh Bóng',
   N'Làm sạch mảng bám và cao răng bằng thiết bị siêu âm, kết hợp đánh bóng phục hồi men răng tự nhiên.',
   60, 300000, 1),

  ('66666666-0000-0000-0000-000000000003',
   N'Massage Đá Nóng Toàn Thân',
   N'Liệu trình massage thư giãn toàn thân với đá nóng basalt, giúp giảm căng thẳng và đau cơ hiệu quả.',
   90, 780000, 1),

  ('66666666-0000-0000-0000-000000000004',
   N'Điều Trị Mụn Chuẩn Y Khoa',
   N'Thăm khám và điều trị mụn bằng phác đồ y khoa chuẩn, kết hợp ánh sáng trị liệu IPL.',
   60, 500000, 1),

  ('66666666-0000-0000-0000-000000000005',
   N'Phục Hồi Tóc Keratin',
   N'Liệu trình phục hồi tóc hư tổn chuyên sâu với công nghệ Keratin cao cấp, giúp tóc bóng mượt và chắc khỏe.',
   120, 950000, 1);

-- =======================
-- 6. Bookings (lịch đặt chỗ - 5 booking với nhiều trạng thái)
-- =======================
INSERT INTO Bookings (Id, BookingCode, CustomerId, ServiceId, StaffId, BookingDate, StartTime, EndTime, Status, CustomerNote, CancellationReason, CreatedAt)
VALUES
  -- Booking 1: Pending (chờ xác nhận)
  ('77777777-0000-0000-0000-000000000001',
   '#BK-9001',
   '33333333-0000-0000-0000-000000000001',
   '66666666-0000-0000-0000-000000000001',
   '44444444-0000-0000-0000-000000000001',
   '2026-09-27',
   '2026-09-27 09:00:00',
   '2026-09-27 10:30:00',
   'Pending',
   N'Da nhạy cảm, nhờ BS kiểm tra trước khi làm liệu trình.',
   NULL,
   '2026-09-25T08:30:00'),

  -- Booking 2: Confirmed (đã xác nhận)
  ('77777777-0000-0000-0000-000000000002',
   '#BK-9002',
   '33333333-0000-0000-0000-000000000001',
   '66666666-0000-0000-0000-000000000003',
   '44444444-0000-0000-0000-000000000002',
   '2026-09-28',
   '2026-09-28 10:00:00',
   '2026-09-28 11:30:00',
   'Confirmed',
   N'Khách đã thanh toán cọc qua MoMo.',
   NULL,
   '2026-09-24T14:00:00'),

  -- Booking 3: Completed (đã hoàn thành)
  ('77777777-0000-0000-0000-000000000003',
   '#BK-9003',
   '33333333-0000-0000-0000-000000000002',
   '66666666-0000-0000-0000-000000000002',
   '44444444-0000-0000-0000-000000000001',
   '2026-09-23',
   '2026-09-23 09:00:00',
   '2026-09-23 10:00:00',
   'Completed',
   N'Yêu cầu làm thêm răng số 7.',
   NULL,
   '2026-09-22T09:00:00'),

  -- Booking 4: Cancelled (đã hủy bởi khách)
  ('77777777-0000-0000-0000-000000000004',
   '#BK-9004',
   '33333333-0000-0000-0000-000000000002',
   '66666666-0000-0000-0000-000000000004',
   '44444444-0000-0000-0000-000000000001',
   '2026-09-24',
   '2026-09-24 14:00:00',
   '2026-09-24 15:00:00',
   'Cancelled',
   NULL,
   N'Khách bận đột xuất, xin hủy lịch.',
   '2026-09-22T11:30:00'),

  -- Booking 5: Pending (chờ xác nhận từ khách mới)
  ('77777777-0000-0000-0000-000000000005',
   '#BK-9005',
   '33333333-0000-0000-0000-000000000002',
   '66666666-0000-0000-0000-000000000005',
   '44444444-0000-0000-0000-000000000002',
   '2026-09-30',
   '2026-09-30 13:00:00',
   '2026-09-30 15:00:00',
   'Pending',
   N'Tóc đã qua xử lý hóa chất, nhờ KTV tư vấn thêm.',
   NULL,
   '2026-09-25T10:00:00');
