import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";

export async function getCurrentAdmin() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifyAdminSessionToken(token);
  if (!session) return null;

  return prisma.adminUser.findUnique({ where: { id: session.adminId } });
}
