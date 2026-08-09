import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { CART_COOKIE, getCartWithItems, cartSubtotalCents } from "@/lib/cart";
import { generateOrderNumber } from "@/lib/order";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

const SHIPPING_CENTS = Number(process.env.SHIPPING_FLAT_RATE_CENTS ?? 490);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;


type ShippingAddressInput = {
  fullName: string;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
};

export async function POST(req: NextRequest) {
  const sessionId = req.cookies.get(CART_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.json({ error: "Panier introuvable" }, { status: 400 });
  }

  const { email, shippingAddress } = (await req.json()) as {
    email?: string;
    shippingAddress?: ShippingAddressInput;
  };

  if (
    !email ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    !shippingAddress?.fullName ||
    !shippingAddress?.line1 ||
    !shippingAddress?.postalCode ||
    !shippingAddress?.city ||
    !shippingAddress?.country
  ) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  const cart = await getCartWithItems(sessionId);
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  if (cart.items.some((item) => !item.product.isActive || item.quantity > item.product.stock)) {
    return NextResponse.json({ error: "Un produit est indisponible ou le stock a changé" }, { status: 409 });
  }
  if (!Number.isFinite(SHIPPING_CENTS) || SHIPPING_CENTS < 0) {
    return NextResponse.json({ error: "Configuration livraison invalide" }, { status: 500 });
  }
  if (!SITE_URL) {
    return NextResponse.json({ error: "URL publique du site non configurée" }, { status: 500 });
  }

  const subtotalCents = cartSubtotalCents(cart.items);
  const totalCents = subtotalCents + SHIPPING_CENTS;

  const sessionToken = req.cookies.get(SESSION_COOKIE)?.value;
  const session = sessionToken ? await verifySessionToken(sessionToken) : null;

  const address = await prisma.address.create({
    data: { ...shippingAddress, customerId: session?.customerId },
  });

  let orderNumber = generateOrderNumber();
  for (let attempt = 0; attempt < 3; attempt++) {
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existing) break;
    orderNumber = generateOrderNumber();
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      email,
      customerId: session?.customerId,
      subtotalCents,
      shippingCents: SHIPPING_CENTS,
      totalCents,
      shippingAddressId: address.id,
      billingAddressId: address.id,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          unitPriceCents: item.unitPriceCents,
          quantity: item.quantity,
          totalCents: item.unitPriceCents * item.quantity,
        })),
      },
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      ...cart.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.unitPriceCents,
          product_data: { name: item.product.name },
        },
      })),
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: SHIPPING_CENTS,
          product_data: { name: "Livraison" },
        },
      },
    ],
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
    success_url: `${SITE_URL}/commande/confirmation/${order.orderNumber}`,
    cancel_url: `${SITE_URL}/panier`,
  });

  // Le panier est conservé jusqu’à confirmation Stripe : un paiement annulé ne doit pas le vider.

  return NextResponse.json({ url: checkoutSession.url });
}
