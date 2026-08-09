import { prisma } from "@/lib/prisma";

export const CART_COOKIE = "cart_session";

export async function getCartWithItems(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
    include: {
      items: { include: { product: true }, orderBy: { id: "asc" } },
    },
  });
}

export function cartSubtotalCents(
  items: { unitPriceCents: number; quantity: number }[]
): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}
