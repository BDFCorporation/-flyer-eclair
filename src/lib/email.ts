import { Resend } from "resend";
import { render } from "@react-email/components";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  email: string;
  items: { productName: string; quantity: number; unitPriceCents: number; totalCents: number }[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}) {
  const html = await render(OrderConfirmationEmail({ order }));

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "commandes@example.com",
    to: order.email,
    subject: `Confirmation de commande ${order.orderNumber}`,
    html,
  });
}
