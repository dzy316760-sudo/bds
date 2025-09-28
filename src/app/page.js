import Link from "next/link";

export default function Home() {
  return (
    <div className="grid" style={{ gap: "2rem" }}>
      <section className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: 700 }}>
          Tăng tỷ lệ lấp đầy với ThuêNhàVN
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "640px", margin: "0 auto 2rem" }}>
          Đăng tin cho thuê nhà đất nhanh chóng, quản lý danh sách bất động sản dễ dàng và tiếp cận hàng nghìn người thuê tiềm năng.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link className="button" href="/listings/create">
            Đăng tin ngay
          </Link>
          <Link className="button secondary" href="/dashboard/landlord">
            Quản lý tin đăng
          </Link>
        </div>
      </section>
      <section className="grid two">
        <div className="card">
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Đăng tin từng bước</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            Biểu mẫu nhiều bước hướng dẫn bạn mô tả rõ ràng về loại bất động sản, tiện nghi và mức giá.
          </p>
        </div>
        <div className="card">
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Quản lý tập trung</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
            Bảng điều khiển dành cho chủ nhà hiển thị toàn bộ tin đăng với các hành động nhanh: chỉnh sửa, đánh dấu đã thuê hoặc xóa.
          </p>
        </div>
      </section>
    </div>
  );
}
