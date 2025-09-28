import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireLandlord } from "@/lib/auth";

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

const statusSchema = z.object({
  status: z.enum(["AVAILABLE", "RENTED", "DRAFT"]).optional(),
});

export async function GET(request, { params }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 });
  }
  return NextResponse.json(listing);
}

export async function PUT(request, { params }) {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    return NextResponse.json({ message: "Không được phép" }, { status: 403 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.landlordId !== landlord.id) {
    return NextResponse.json({ message: "Không tìm thấy tin đăng" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = listingInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  const updated = await prisma.listing.update({
    where: { id: params.id },
    data: {
      ...data,
      furniture: data.furniture,
      media: data.media,
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(request, { params }) {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    return NextResponse.json({ message: "Không được phép" }, { status: 403 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.landlordId !== landlord.id) {
    return NextResponse.json({ message: "Không tìm thấy tin đăng" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  const updated = await prisma.listing.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status || "RENTED",
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  let landlord;
  try {
    landlord = await requireLandlord();
  } catch (error) {
    return NextResponse.json({ message: "Không được phép" }, { status: 403 });
  }

  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing || listing.landlordId !== landlord.id) {
    return NextResponse.json({ message: "Không tìm thấy tin đăng" }, { status: 404 });
  }

  await prisma.listing.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
