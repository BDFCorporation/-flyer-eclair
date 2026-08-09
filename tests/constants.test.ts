import { describe, expect, it } from "vitest";
import { PRODUCTS, PRODUCT_PRICE_CENTS } from "@/lib/constants";

describe("catalogue des parfums", () => {
  it("expose exactement les 4 noms imposés, dans cet ordre", () => {
    const names = PRODUCTS.map((p) => p.name);
    expect(names).toEqual(["Aisha", "Bois Intense", "Sauvage Intense", "Bakara"]);
  });

  it("fixe le prix à 14,99 € (1499 centimes) pour chaque parfum", () => {
    expect(PRODUCT_PRICE_CENTS).toBe(1499);
  });

  it("garde des slugs stables dérivés des noms", () => {
    const slugs = PRODUCTS.map((p) => p.slug);
    expect(slugs).toEqual(["aisha", "bois-intense", "sauvage-intense", "bakara"]);
  });
});
