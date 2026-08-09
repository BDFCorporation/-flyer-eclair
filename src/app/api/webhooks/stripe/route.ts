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
      const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
      if (!existingOrder || existingOrder.status !== "PENDING") {
        // Déjà payée (idempotence) ou annulée (stock déjà libéré, cf. /api/checkout) : rien à faire.
        return NextResponse.json({ received: true });
      }

      // Le stock est réservé de façon atomique à la création de la commande
      // (voir /api/checkout) : ce webhook se contente de confirmer le paiement.
      let order;
      try {
        order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentIntentId:
              typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          },
          include: { items: true },
        });
      } catch (err) {
        console.error(`[stripe-webhook] échec de la finalisation de la commande ${orderId}`, err);
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
