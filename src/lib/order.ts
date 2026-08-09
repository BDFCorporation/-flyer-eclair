import { randomBytes } from "crypto";

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = randomBytes(6).toString("base64url").slice(0, 8).toUpperCase();
  return `CMD-${y}${m}${d}-${random}`;
}
