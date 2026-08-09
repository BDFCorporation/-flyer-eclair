import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { CartIndicator } from "@/components/cart/CartIndicator";

const NAV_LINKS = [
  { href: "/parfums", label: "Parfums" },
  { href: "/flyers/index.html", label: "Flyer Éclair" },
  { href: "/bdf-production/index.html", label: "Audiovisuel" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="hidden gap-6 text-sm sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/70 hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/compte" className="text-ink/70 hover:text-ink">
            Mon compte
          </Link>
          <CartIndicator />
        </div>
      </div>
    </header>
  );
}
