// Drizzle table definitions live here.
// Better Auth writes its tables to ./auth-schema.ts (`npm run auth:generate`),
// which is re-exported below so it never overwrites the store tables.
// Create migrations with `npm run db:generate`.
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export * from "./auth-schema";

export type GalleryImage = {
  src: string;
  alt: string;
  // Renders a zoomed crop of the image, centred on this CSS
  // transform-origin, to stand in for a close-up detail shot.
  detailFocus?: string;
};

// Display-only: stock is tracked per product, not per size.
export type Size = {
  label: string;
  available: boolean;
};

export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  description: text(),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
  // Featured categories appear as "The Collections" on the home page.
  featured: boolean().notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sku: text().notNull().unique(),
    slug: text().notNull().unique(),
    name: text().notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    priceCents: integer("price_cents").notNull(),
    stock: integer().notNull().default(0),
    colour: text().notNull(),
    description: text().notNull(),
    details: text().array().notNull().default(sql`'{}'::text[]`),
    imageUrl: text("image_url").notNull(),
    imageAlt: text("image_alt").notNull(),
    // Excludes the main image, which is always shown first.
    gallery: jsonb().$type<GalleryImage[]>().notNull().default([]),
    // Null for one-size items.
    sizes: jsonb().$type<Size[]>(),
    badge: text(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    check("products_price_cents_non_negative", sql`${table.priceCents} >= 0`),
    check("products_stock_non_negative", sql`${table.stock} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
