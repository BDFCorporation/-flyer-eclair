import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/adminSession";

const VALID_STATUSES = Object.values(OrderStatus);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { status } = (await req.json()) as { status?: string };
  if (!status || !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status: status as OrderStatus },
  });

  return NextResponse.json(order);
}
