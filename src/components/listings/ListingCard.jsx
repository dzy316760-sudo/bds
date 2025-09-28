"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0);

export default function ListingCard({ listing }) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState(null);
  const cover = listing.media?.images?.[0];

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa tin đăng này?");
    if (!confirmDelete) return;

    try {
      setLoadingAction("delete");
      const response = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Không thể xóa tin đăng");
      toast.success("Đã xóa tin đăng");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMarkRented = async () => {
    try {
      setLoadingAction("status");
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RENTED" }),
      });
      if (!response.ok) throw new Error("Không thể cập nhật trạng thái");
      toast.success("Đã đánh dấu đã thuê");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <article className="card listing-card">
      <div style={{ position: "relative" }}>
        {cover ? (
          <img src={cover} alt={listing.title} className="listing-card__media" />
        ) : (
          <div
            className="listing-card__media"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f1f5f9",
              color: "var(--muted)",
              fontWeight: 600,
            }}
          >
            Không có ảnh
          </div>
        )}
        <span className="badge" style={{ position: "absolute", top: 16, left: 16 }}>
          {listing.status === "RENTED" ? "Đã thuê" : "Đang mở"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{listing.title}</h3>
        <p style={{ color: "var(--muted)" }}>{listing.address}</p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", color: "var(--muted)", fontSize: "0.9rem" }}>
          <span>{listing.propertyType}</span>
          <span>• {listing.area} m²</span>
          <span>• {listing.bedrooms} PN</span>
          <span>• {listing.bathrooms} PT</span>
        </div>
        <strong style={{ fontSize: "1.1rem" }}>{formatCurrency(listing.price)}</strong>
      </div>

      <div className="listing-card__actions">
        <Link className="button secondary" href={`/listings/${listing.id}`}>
          Xem tin
        </Link>
        <Link className="button secondary" href={`/listings/${listing.id}/edit`}>
          Chỉnh sửa
        </Link>
        <button
          type="button"
          className="button secondary"
          onClick={handleDelete}
          disabled={loadingAction === "delete"}
        >
          {loadingAction === "delete" ? "Đang xóa..." : "Xóa tin"}
        </button>
        <button
          type="button"
          className="button"
          onClick={handleMarkRented}
          disabled={listing.status === "RENTED" || loadingAction === "status"}
        >
          {loadingAction === "status" ? "Đang cập nhật..." : "Đánh dấu đã thuê"}
        </button>
      </div>
    </article>
  );
}
