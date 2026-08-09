import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message } = (await req.json()) as {
    name?: string;
    email?: string;
    message?: string;
  };

  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "commandes@example.com",
    to: process.env.CONTACT_EMAIL ?? process.env.EMAIL_FROM ?? "commandes@example.com",
    replyTo: email,
    subject: `Nouveau message de contact — ${name}`,
    text: message,
  });

  return NextResponse.json({ ok: true });
}
