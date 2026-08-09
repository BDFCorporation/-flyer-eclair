import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/adminSession";

/**
 * Ne pas exposer name/slug ici : les noms des 4 parfums sont figés
 * (voir src/lib/constants.ts) et ne doivent pas être modifiables depuis l'admin.
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { stock, isActive } = (await req.json()) as {
    stock?: number;
    isActive?: boolean;
  };

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    return NextResponse.json({ error: "Stock invalide" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      ...(stock !== undefined ? { stock } : {}),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
    },
  });

  return NextResponse.json(product);
}
