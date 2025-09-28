# ThuêNhàVN

Nền tảng cho thuê bất động sản được xây dựng với **Next.js 14 (App Router)**, **Tailwind CSS**, **Prisma ORM** và **Firebase Authentication**.

## Tính năng nổi bật

- Giao diện App Router với bố cục Navbar, Footer, trang chủ và trang 404 tuỳ chỉnh.
- Tailwind CSS cấu hình với font Inter, hỗ trợ responsive.
- Form tìm kiếm nhanh và form đăng ký sử dụng React Hook Form + Zod.
- Tích hợp Firebase Authentication (Email/Password + Phone OTP) với hướng dẫn cấu hình.
- Prisma ORM kết nối PostgreSQL với schema đã định nghĩa cho Users và Listings.

## Cấu trúc thư mục chính

```
/app          # Layout, trang chủ, trang 404
/components   # Navbar, Footer, form, card hiển thị listing
/lib          # Cấu hình Prisma Client & Firebase
/prisma       # Định nghĩa schema Prisma
/types        # Các kiểu TypeScript dùng chung
```

## Bắt đầu

1. Cài đặt phụ thuộc:

```bash
npm install
```

2. Cấu hình biến môi trường trong `.env.local`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
```

3. Đẩy schema Prisma lên cơ sở dữ liệu PostgreSQL:

```bash
npx prisma db push
```

4. Khởi chạy máy chủ phát triển:

```bash
npm run dev
```

## Cấu hình Firebase Authentication

1. Tạo dự án Firebase và kích hoạt Authentication.
2. Trong tab **Sign-in method**, bật **Email/Password** và **Phone**.
3. Thêm domain phát triển (ví dụ: `http://localhost:3000`) vào danh sách được phép.
4. Sao chép các khóa cấu hình web app vào `.env.local` như ở trên.
5. Đối với xác thực số điện thoại, đảm bảo bạn đã bật reCAPTCHA và thêm `recaptcha-container` vào layout nếu cần tùy chỉnh.

## Ghi chú phát triển

- Dự án sử dụng module `lucide-react` cho biểu tượng menu.
- Các enum trong Prisma sử dụng ký tự gạch dưới để tương thích, cần map khi seed dữ liệu thật.
- Bạn có thể mở rộng App Router với các route `app/(marketing)` hoặc API route để thao tác dữ liệu thực tế.

Chúc bạn xây dựng nền tảng ThuêNhàVN thành công!
