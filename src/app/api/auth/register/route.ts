import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, name } = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "E-mail et mot de passe (8 caractères minimum) requis" },
      { status: 400 }
    );
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet e-mail" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { email, passwordHash, name },
  });

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
