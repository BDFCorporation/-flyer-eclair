import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "E-mail et mot de passe requis" }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer?.passwordHash || !(await bcrypt.compare(password, customer.passwordHash))) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  const token = await createSessionToken(customer.id);
  const res = NextResponse.json({ id: customer.id, email: customer.email });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
