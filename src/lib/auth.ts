import { SignJWT, jwtVerify } from "jose";

const authSecret = process.env.AUTH_SECRET;
if (process.env.NODE_ENV === "production" && (!authSecret || authSecret.length < 32)) {
  throw new Error("AUTH_SECRET doit contenir au moins 32 caractères en production.");
}
const secret = new TextEncoder().encode(authSecret ?? "dev-secret-change-me");

export const SESSION_COOKIE = "customer_session";
export const ADMIN_SESSION_COOKIE = "admin_session";

export async function createSessionToken(customerId: string): Promise<string> {
  return new SignJWT({ customerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(
  token: string
): Promise<{ customerId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.customerId === "string") {
      return { customerId: payload.customerId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createAdminSessionToken(adminId: string): Promise<string> {
  return new SignJWT({ adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminSessionToken(
  token: string
): Promise<{ adminId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.adminId === "string") {
      return { adminId: payload.adminId };
    }
    return null;
  } catch {
    return null;
  }
}
