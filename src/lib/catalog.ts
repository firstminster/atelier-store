// Catalogue types, display helpers and the editorial imagery on the home page.
// Products and categories live in the database: see src/lib/products.ts for
// the reads and src/db/seed.ts for the sample data.
// Images are from Unsplash (https://unsplash.com/license).

import type { GalleryImage, Size } from "@/db/schema";

export type { GalleryImage, Size };

export type CatalogImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: number;
  sku: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number; // minor units (cents)
  colour: string;
  stock: number;
  image: CatalogImage;
  gallery: GalleryImage[]; // excludes `image`, which is always shown first
  description: string;
  details: string[];
  sizes?: Size[]; // omitted for one-size items
  badge?: string;
};

export type Collection = {
  slug: string;
  name: string;
  description: string;
  image: CatalogImage;
};

// Every image uses the same query string so next.config.ts can allow
// exactly this pattern for remote optimisation.
export const UNSPLASH_QUERY = "?w=1600&q=75&fm=jpg";

export function unsplash(id: string, alt: string): CatalogImage {
  return { src: `https://images.unsplash.com/photo-${id}${UNSPLASH_QUERY}`, alt };
}

export const heroImages: [CatalogImage, CatalogImage] = [
  unsplash(
    "1574015974293-817f0ebebb74",
    "Black and white portrait of a model in a dark coat, hair in motion",
  ),
  unsplash(
    "1613915617430-8ab0fd7c6baf",
    "Black and white portrait of a model in a grey blazer and trousers",
  ),
];

export const editorial = {
  feature: unsplash(
    "1580478491436-fd6a937acc9e",
    "Model in an oxblood blazer and leather gloves seated on stairs",
  ),
  campaign: unsplash(
    "1562151270-c7d22ceb586a",
    "Model in a flowing saffron dress against a bright blue sky",
  ),
};

export const LOW_STOCK_THRESHOLD = 3;

export type StockState =
  | { status: "in-stock"; label: string }
  | { status: "low-stock"; label: string }
  | { status: "sold-out"; label: string };

export function getStockState(product: Product): StockState {
  if (product.stock <= 0) return { status: "sold-out", label: "Sold out" };
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return { status: "low-stock", label: `Only ${product.stock} left` };
  }
  return { status: "in-stock", label: "In stock" };
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(minorUnits: number) {
  return priceFormatter.format(minorUnits / 100);
}
