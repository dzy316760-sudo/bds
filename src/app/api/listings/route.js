import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getCurrentUser, requireLandlord } from "@/lib/auth";

const listingInputSchema = z.object({
  title: z.string().min(5),
  propertyType: z.string().min(1),
  description: z.string().min(20),
  address: z.string().min(5),
  latitude: z.number(),
  longitude: z.number(),
  area: z.number().positive(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  furniture: z.array(z.string()).default([]),
  price: z.number().positive(),
  deposit: z.number().nonnegative().optional(),
  media: z.object({
    images: z.array(z.string()).min(1),
    videos: z.array(z.string()),
  }),
});

export async function GET(request) {
  const currentUser = await getCurrentUser();
  const mine = request.nextUrl.searchParams.get("mine");

  if (mine === "true" && currentUser?.role === "LANDLORD") {
    const listings = await prisma.listing.findMany({
      where: { landlordId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(listings);
  }

  const listings = await prisma.listing.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(listings);
}

export async function POST(request) {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    return NextResponse.json({ message: "Chỉ chủ nhà mới được đăng tin" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = listingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  const payload = parsed.data;

  const created = await prisma.listing.create({
    data: {
      ...payload,
      landlordId: landlord.id,
      furniture: payload.furniture,
      media: payload.media,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
