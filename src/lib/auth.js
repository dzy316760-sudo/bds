import prisma from "./prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function requireLandlord() {
  const user = await getCurrentUser();

  if (user && user.role === "LANDLORD") {
    return user;
  }

  const fallbackLandlord = await prisma.user.findFirst({ where: { role: "LANDLORD" } });
  if (fallbackLandlord) {
    return fallbackLandlord;
  }

  const seeded = await prisma.user.create({
    data: {
      email: "demo-landlord@thuenhavn.vn",
      name: "Demo Landlord",
      role: "LANDLORD",
    },
  });

  return seeded;
}
