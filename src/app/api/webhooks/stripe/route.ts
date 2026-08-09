import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!existingOrder || existingOrder.status === "PAID") {
        return NextResponse.json({ received: true });
      }

      let order;
      try {
        order = await prisma.$transaction(async (tx) => {
          for (const item of existingOrder.items) {
            const updated = await tx.product.updateMany({
              where: { id: item.productId, stock: { gte: item.quantity } },
              data: { stock: { decrement: item.quantity } },
            });
            if (updated.count !== 1) throw new Error("Stock insuffisant après paiement");
          }
          return tx.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              stripePaymentIntentId:
                typeof session.payment_intent === "string" ? session.payment_intent : undefined,
            },
            include: { items: true },
          });
        });
      } catch (err) {
        // Le client a été débité mais le stock ne permet plus d'honorer la commande :
        // on ne relance pas la commande en boucle côté Stripe (200 pour éviter les retries),
        // on marque la commande pour reprise manuelle par un humain.
        console.error(`[stripe-webhook] échec de la finalisation de la commande ${orderId}`, err);
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
        return NextResponse.json({ received: true });
      }

      await sendOrderConfirmationEmail({
        orderNumber: order.orderNumber,
        email: order.email,
        items: order.items,
        subtotalCents: order.subtotalCents,
        shippingCents: order.shippingCents,
        totalCents: order.totalCents,
      });
    }
  }

  return NextResponse.json({ received: true });
}
