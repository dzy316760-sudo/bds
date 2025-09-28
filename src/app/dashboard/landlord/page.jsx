import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireLandlord } from "@/lib/auth";
import ListingCard from "@/components/listings/ListingCard";

export const metadata = {
  title: "Bảng điều khiển chủ nhà | ThuêNhàVN",
};

export const dynamic = "force-dynamic";

export default async function LandlordDashboardPage() {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    redirect("/");
  }

  const listings = await prisma.listing.findMany({
    where: { landlordId: landlord.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid" style={{ gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontWeight: 700 }}>Tin đăng của bạn</h1>
        <p style={{ color: "var(--muted)" }}>
          Theo dõi hiệu quả các tin đăng, chỉnh sửa nội dung hoặc đánh dấu bất động sản đã cho thuê.
        </p>
      </div>
      {listings.length === 0 ? (
        <div className="card">
          <p>Bạn chưa có tin đăng nào. Bắt đầu bằng cách tạo tin mới.</p>
        </div>
      ) : (
        <div className="grid" style={{ gap: "1.25rem" }}>
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
