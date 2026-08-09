import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/adminSession";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between border-b border-ink/10 pb-4">
        <nav className="flex gap-6 text-sm">
          <Link href="/admin" className="font-medium">
            Tableau de bord
          </Link>
          <Link href="/admin/produits" className="text-ink/60 hover:text-ink">
            Produits
          </Link>
          <Link href="/admin/commandes" className="text-ink/60 hover:text-ink">
            Commandes
          </Link>
        </nav>
        <span className="text-sm text-ink/50">{admin.email}</span>
      </div>
      {children}
    </div>
  );
}
