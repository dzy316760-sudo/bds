import { redirect } from "next/navigation";
import ListingForm from "@/components/listings/ListingForm";
import { requireLandlord } from "@/lib/auth";

export const metadata = {
  title: "Đăng tin mới | ThuêNhàVN",
};

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    redirect("/");
  }

  return (
    <div className="grid" style={{ gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontWeight: 700 }}>Đăng tin cho thuê</h1>
        <p style={{ color: "var(--muted)" }}>
          Điền thông tin theo từng bước để hoàn tất tin đăng bất động sản của bạn.
        </p>
      </div>
      <ListingForm landlordId={landlord.id} />
    </div>
  );
}
