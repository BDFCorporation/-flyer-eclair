import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function getCurrentCustomer() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  return prisma.customer.findUnique({ where: { id: session.customerId } });
}
