# ThuêNhàVN

ThuêNhàVN là ứng dụng Next.js giúp chủ nhà đăng tin cho thuê bất động sản với quy trình đa bước, quản lý tin đăng và hiển thị thông tin chi tiết kèm bản đồ.

## Tính năng chính

- Đăng tin mới tại `/listings/create` với biểu mẫu 5 bước: loại hình, media (tải lên Firebase Storage, tối đa 10 ảnh/video), địa chỉ tích hợp Google Maps, thông tin diện tích/phòng và giá tiền (định dạng VND).
- Bảng điều khiển chủ nhà tại `/dashboard/landlord` hiển thị danh sách tin đăng dạng thẻ kèm hành động chỉnh sửa, xóa và đánh dấu đã thuê.
- Trang chi tiết tin `/listings/[id]` với đầy đủ nội dung, thư viện media và bản đồ Google Maps, SEO meta `Cho thuê {propertyType} {address}`.
- API routes `/api/listings` và `/api/listings/[id]` (GET/POST/PUT/PATCH/DELETE) được bảo vệ cho vai trò chủ nhà.
- Prisma + SQLite với migrations trong `prisma/migrations`.

## Thiết lập

1. Cập nhật `.env` với cấu hình Firebase Storage và Google Maps API (`NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).
2. Chạy migrations và khởi tạo Prisma Client:

```bash
npx prisma migrate deploy
```

3. Khởi chạy ứng dụng:

```bash
npm run dev
```

> Lần đầu truy cập, hệ thống tự tạo tài khoản demo `demo-landlord@thuenhavn.vn` để thuận tiện thử nghiệm các trang dành cho chủ nhà.
