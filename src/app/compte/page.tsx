import Link from "next/link";
import { getCurrentCustomer } from "@/lib/session";
import { AuthForms } from "@/components/account/AuthForms";
import { LogoutButton } from "@/components/account/LogoutButton";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const customer = await getCurrentCustomer();

  if (!customer) {
    return (
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-display text-3xl mb-8">Mon compte</h1>
        <p className="mb-6 text-sm text-ink/60">
          Un compte est optionnel : vous pouvez commander en tant qu&apos;invité. Créez-en un
          pour retrouver l&apos;historique de vos commandes.
        </p>
        <AuthForms />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Bonjour {customer.name ?? customer.email}</h1>
      <p className="text-ink/60 mb-8">{customer.email}</p>
      <Link href="/compte/commandes" className="underline">
        Voir mes commandes
      </Link>
      <div className="mt-8">
        <LogoutButton />
      </div>
    </main>
  );
}
