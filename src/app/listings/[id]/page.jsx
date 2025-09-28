import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ListingMap from "@/components/listings/ListingMap";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0);

export async function generateMetadata({ params }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return { title: "Tin đăng không tồn tại | ThuêNhàVN" };
  }

  return {
    title: `Cho thuê ${listing.propertyType} ${listing.address}`,
    description: listing.description?.slice(0, 155) || "Tin đăng bất động sản trên ThuêNhàVN",
  };
}

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({ params }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    notFound();
  }

  const media = listing.media || { images: [], videos: [] };
  const furniture = Array.isArray(listing.furniture) ? listing.furniture : [];

  return (
    <article className="grid" style={{ gap: "2rem" }}>
      <div className="card" style={{ padding: 0 }}>
        {media.images?.length > 0 ? (
          <div className="media-preview" style={{ margin: 0 }}>
            {media.images.map((url) => (
              <div key={url} className="media-preview__item">
                <img src={url} alt={listing.title} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--muted)" }}>Tin đăng chưa có hình ảnh.</div>
        )}
      </div>

      <section className="grid" style={{ gap: "1.5rem" }}>
        <div className="grid" style={{ gap: "0.5rem" }}>
          <span className="badge" style={{ width: "fit-content" }}>
            {listing.status === "RENTED" ? "Đã thuê" : "Đang mở"}
          </span>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>{listing.title}</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>{listing.address}</p>
          <strong style={{ fontSize: "1.4rem" }}>{formatCurrency(listing.price)} / tháng</strong>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Thông tin tổng quan</h2>
          <div className="grid two">
            <div>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loại bất động sản</span>
              <p style={{ fontWeight: 600 }}>{listing.propertyType}</p>
            </div>
            <div>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Diện tích</span>
              <p style={{ fontWeight: 600 }}>{listing.area} m²</p>
            </div>
            <div>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Phòng ngủ</span>
              <p style={{ fontWeight: 600 }}>{listing.bedrooms}</p>
            </div>
            <div>
              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Phòng tắm</span>
              <p style={{ fontWeight: 600 }}>{listing.bathrooms}</p>
            </div>
            {listing.deposit ? (
              <div>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Tiền đặt cọc</span>
                <p style={{ fontWeight: 600 }}>{formatCurrency(listing.deposit)}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Mô tả chi tiết</h2>
          <p style={{ lineHeight: 1.7 }}>{listing.description}</p>
        </div>

        {furniture.length > 0 && (
          <div className="card">
            <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Tiện nghi</h2>
            <div className="tag-list">
              {furniture.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Vị trí</h2>
          <ListingMap latitude={listing.latitude} longitude={listing.longitude} />
        </div>

        {media.videos?.length > 0 && (
          <div className="card">
            <h2 style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>Video</h2>
            <div className="media-preview">
              {media.videos.map((url) => (
                <div key={url} className="media-preview__item">
                  <video src={url} controls />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
