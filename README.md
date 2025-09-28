# ThuêNhàVN Portal

Ứng dụng ThuêNhàVN xây dựng bằng Next.js với xác thực Firebase, quản lý hồ sơ theo vai trò (Chủ nhà, Nhà tiếp thị, Môi giới) và các trang bảo vệ bằng middleware.

## Thiết lập

1. Cài đặt phụ thuộc:
   ```bash
   npm install
   ```
2. Tạo file `.env.local` với thông tin Firebase của bạn:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   ```
3. Khởi chạy ứng dụng:
   ```bash
   npm run dev
   ```

## Tính năng chính

- Đăng ký/Đăng nhập với Firebase Authentication.
- Lưu hồ sơ người dùng lên Cloud Firestore và đồng bộ cookie để middleware kiểm tra.
- Tải ảnh đại diện lên Firebase Storage.
- Trang hồ sơ hiển thị nội dung theo vai trò với các tab chức năng riêng.
- Bảo vệ tuyến đường `/profile` bằng middleware và ẩn menu khi chưa đăng nhập.
- Schema Prisma để đồng bộ với dữ liệu hồ sơ nếu cần tích hợp cơ sở dữ liệu riêng.
