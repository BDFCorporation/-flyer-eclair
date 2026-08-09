import { Html, Head, Body, Container, Section, Text, Hr } from "@react-email/components";
import { formatPriceCents } from "@/lib/constants";

type OrderConfirmationProps = {
  order: {
    orderNumber: string;
    items: { productName: string; quantity: number; totalCents: number }[];
    subtotalCents: number;
    shippingCents: number;
    totalCents: number;
  };
};

export function OrderConfirmationEmail({ order }: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f6f4f1" }}>
        <Container style={{ padding: "32px", backgroundColor: "#ffffff" }}>
          <Text style={{ fontSize: "20px", fontWeight: 700 }}>
            Merci pour votre commande {order.orderNumber}
          </Text>
          <Section>
            {order.items.map((item, index) => (
              <Text key={`${item.productName}-${index}`}>
                {item.productName} × {item.quantity} — {formatPriceCents(item.totalCents)}
              </Text>
            ))}
          </Section>
          <Hr />
          <Text>Sous-total : {formatPriceCents(order.subtotalCents)}</Text>
          <Text>Livraison : {formatPriceCents(order.shippingCents)}</Text>
          <Text style={{ fontWeight: 700 }}>Total : {formatPriceCents(order.totalCents)}</Text>
        </Container>
      </Body>
    </Html>
  );
}
