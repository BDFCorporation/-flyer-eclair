import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS, PRODUCT_PRICE_CENTS, CURRENCY } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        priceCents: PRODUCT_PRICE_CENTS,
        currency: CURRENCY,
      },
      create: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        priceCents: PRODUCT_PRICE_CENTS,
        currency: CURRENCY,
        stock: 100,
        isActive: true,
        metaTitle: `${product.name} — Parfum 14,99 €`,
        metaDescription: product.shortDescription,
      },
    });
    console.log(`Produit synchronisé : ${product.name}`);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash },
    });
    console.log(`Compte admin synchronisé : ${adminEmail}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
