import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { CART_COOKIE, getCartWithItems, cartSubtotalCents } from "@/lib/cart";

function resolveSessionId(req: NextRequest): { sessionId: string; isNew: boolean } {
  const existing = req.cookies.get(CART_COOKIE)?.value;
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: randomUUID(), isNew: true };
}

function withCookie(res: NextResponse, sessionId: string, isNew: boolean) {
  if (isNew) {
    res.cookies.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}

async function serializeCart(sessionId: string) {
  const cart = await getCartWithItems(sessionId);
  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCents,
    totalCents: item.unitPriceCents * item.quantity,
  }));
  return { items, subtotalCents: cartSubtotalCents(items) };
}

export async function GET(req: NextRequest) {
  const { sessionId, isNew } = resolveSessionId(req);
  const body = await serializeCart(sessionId);
  return withCookie(NextResponse.json(body), sessionId, isNew);
}

export async function POST(req: NextRequest) {
  const { sessionId, isNew } = resolveSessionId(req);
  const { productId, quantity } = (await req.json()) as {
    productId?: string;
    quantity?: number;
  };

  if (
    typeof productId !== "string" ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 0 ||
    quantity > 99
  ) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  if (quantity > product.stock) {
    return NextResponse.json({ error: "Stock insuffisant" }, { status: 409 });
  }

  const cart = await prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  } else {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity, unitPriceCents: product.priceCents },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        unitPriceCents: product.priceCents,
      },
    });
  }

  const body = await serializeCart(sessionId);
  return withCookie(NextResponse.json(body), sessionId, isNew);
}

export async function DELETE(req: NextRequest) {
  const { sessionId, isNew } = resolveSessionId(req);
  const { productId } = (await req.json()) as { productId?: string };

  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (cart && productId) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  }

  const body = await serializeCart(sessionId);
  return withCookie(NextResponse.json(body), sessionId, isNew);
}
