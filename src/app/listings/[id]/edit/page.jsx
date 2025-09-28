import { redirect } from "next/navigation";
import ListingForm from "@/components/listings/ListingForm";
import prisma from "@/lib/prisma";
import { requireLandlord } from "@/lib/auth";

export const metadata = {
  title: "Chỉnh sửa tin đăng | ThuêNhàVN",
};

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }) {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    redirect("/");
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.landlordId !== landlord.id) {
    redirect("/dashboard/landlord");
  }

  const serializedListing = {
    ...listing,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };

  return (
    <div className="grid" style={{ gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontWeight: 700 }}>Chỉnh sửa tin đăng</h1>
        <p style={{ color: "var(--muted)" }}>Cập nhật nội dung để tin đăng luôn hấp dẫn người thuê.</p>
      </div>
      <ListingForm listing={serializedListing} landlordId={landlord.id} />
    </div>
  );
}
