import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "BDF Production : location de matériel audiovisuel, flyers professionnels sur-mesure et parfums en ligne.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-body flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
