// Catalogue reads. Results are cached for hours and tagged "products":
// after changing products or stock directly in the database, call
// revalidateTag("products") (or redeploy) to refresh the storefront.
import { and, asc, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import type { Collection, Product } from "@/lib/catalog";

const productColumns = {
  product: products,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

function selectProducts() {
  return db
    .select(productColumns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));
}

type ProductRow = Awaited<ReturnType<typeof selectProducts>>[number];

function toProduct({ product, categoryName, categorySlug }: ProductRow): Product {
  return {
    id: product.id,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    category: categoryName,
    categorySlug,
    price: product.priceCents,
    colour: product.colour,
    stock: product.stock,
    image: { src: product.imageUrl, alt: product.imageAlt },
    gallery: product.gallery,
    description: product.description,
    details: product.details,
    sizes: product.sizes ?? undefined,
    badge: product.badge ?? undefined,
  };
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await selectProducts()
    .orderBy(desc(products.createdAt), desc(products.id))
    .limit(limit);
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const [row] = await selectProducts().where(eq(products.slug, slug)).limit(1);
  return row ? toProduct(row) : undefined;
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((row) => row.slug);
}

/* Same category first, then the rest of the catalogue. */
export async function getRelatedProducts(
  productId: number,
  categorySlug: string,
  limit = 4,
): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await selectProducts()
    .where(ne(products.id, productId))
    .orderBy(
      desc(sql`${categories.slug} = ${categorySlug}`),
      desc(products.createdAt),
      desc(products.id),
    )
    .limit(limit);
  return rows.map(toProduct);
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.featured, true),
        isNotNull(categories.imageUrl),
        isNotNull(categories.imageAlt),
      ),
    )
    .orderBy(asc(categories.sortOrder), asc(categories.id));

  return rows.map((category) => ({
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    image: { src: category.imageUrl!, alt: category.imageAlt! },
  }));
}
