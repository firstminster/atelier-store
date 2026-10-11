// Seeds the sample catalogue. Safe to re-run: it replaces every category and
// product in a single batch, which neon-http runs as one transaction.
// Run with `npm run db:seed`.
import "dotenv/config";

import { sql } from "drizzle-orm";

import { unsplash, type CatalogImage } from "../lib/catalog";
import { db } from "./index";
import { categories, products, type GalleryImage, type Size } from "./schema";

function detail(image: CatalogImage, focus: string): GalleryImage {
  return { ...image, alt: `Detail: ${image.alt}`, detailFocus: focus };
}

function sizes(labels: string[], soldOut: string[] = []): Size[] {
  return labels.map((label) => ({ label, available: !soldOut.includes(label) }));
}

const SHOE_SIZES = ["36", "37", "38", "39", "40", "41"];
const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];

// Styled shots shared by products in the same category.
const lifestyle = {
  bagCarried: unsplash(
    "1691804996688-b16726193526",
    "Brown leather bag carried by its top handle in a boutique",
  ),
  bagStreet: unsplash(
    "1699113493447-92ff3e321cdf",
    "Model in a long black coat carrying a brown leather bag",
  ),
  heelsStreet: unsplash(
    "1784460277291-717ccf921849",
    "Black and white street portrait of a model in heels carrying a small bag",
  ),
  heelsMotion: unsplash(
    "1710072373568-f1de200bcb69",
    "Motion-blurred legs walking in black heels",
  ),
  coatLake: unsplash(
    "1777448067392-235aec6a10e4",
    "Model in a camel coat and hat walking beside a lake in autumn",
  ),
  coatStreet: unsplash(
    "1790802088468-bf2a70b08563",
    "Black and white photo of a model crossing a city street, coat over one arm",
  ),
};

type CategorySeed = {
  slug: string;
  name: string;
  description?: string;
  image?: CatalogImage;
  featured?: boolean;
};

const categorySeeds: CategorySeed[] = [
  {
    slug: "tailoring",
    name: "Tailoring",
    description: "Sharp lines, soft shoulders, cut to move.",
    image: unsplash(
      "1618886614638-80e3c103d31a",
      "Model in a black suit standing in front of a stone building",
    ),
    featured: true,
  },
  {
    slug: "leather-goods",
    name: "Leather Goods",
    description: "Hand-finished bags in vegetable-tanned leather.",
    image: unsplash(
      "1691480250099-a63081ecfcb8",
      "Cognac leather top-handle bag with brass studs",
    ),
    featured: true,
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    description: "Sculpted coats and capes for the colder months.",
    image: unsplash(
      "1603189343302-e603f7add05a",
      "Silhouette of a model in an oversized black jacket on white",
    ),
    featured: true,
  },
  { slug: "shoes", name: "Shoes" },
];

const satchelImage = unsplash(
  "1605733513597-a8f8341084e6",
  "Grey leather satchel with gold buckles",
);
const pumpImage = unsplash(
  "1535043934128-cf0b28d52f95",
  "Pair of ivory pointed-toe pumps on a dark lacquered surface",
);
const doctorBagImage = unsplash(
  "1691480150204-66dd1eb77391",
  "Tan leather top-handle bag on white",
);
const derbyImage = unsplash(
  "1783455042943-1a690e6dd46b",
  "Black leather split-toe lace-up shoes on a marble table",
);
const bowlingBagImage = unsplash(
  "1705909237050-7a7625b47fac",
  "Black pebbled-leather bowling bag on a yellow backdrop",
);
const floralPumpImage = unsplash(
  "1543163521-1bf539c55dd2",
  "Pair of floral-print stiletto pumps on a pale blue set",
);
const toteImage = unsplash(
  "1624687943971-e86af76d57de",
  "Cognac leather tote hanging on a white wall",
);

type ProductSeed = {
  sku: string;
  slug: string;
  name: string;
  category: string; // category slug
  price: number; // minor units (cents)
  colour: string;
  stock: number;
  image: CatalogImage;
  gallery: GalleryImage[];
  description: string;
  details: string[];
  sizes?: Size[];
  badge?: string;
};

// Listed newest first: "New In" keeps this order.
const productSeeds: ProductSeed[] = [
  {
    sku: "p-001",
    slug: "archive-satchel",
    name: "Archive Satchel",
    category: "leather-goods",
    price: 189000,
    colour: "Slate grey",
    stock: 12,
    badge: "New",
    image: satchelImage,
    gallery: [detail(satchelImage, "50% 62%"), lifestyle.bagStreet],
    description:
      "A structured satchel drawn from a 1970s document case, with twin buckled straps over a magnetic closure and a short top handle for carrying by hand.",
    details: [
      "Calf leather with a soft-grain finish",
      "Gold-tone brass hardware",
      "Detachable, adjustable shoulder strap",
      "Interior zip pocket and card slots",
      "W 28 × H 21 × D 10 cm",
      "Made in Italy",
    ],
  },
  {
    sku: "p-002",
    slug: "sienna-pump-85",
    name: "Sienna Pump 85",
    category: "shoes",
    price: 79000,
    colour: "Ivory",
    stock: 2,
    image: pumpImage,
    gallery: [detail(pumpImage, "62% 55%"), lifestyle.heelsStreet],
    description:
      "A pointed pump on an 85 mm stiletto, cut low at the vamp to lengthen the line of the foot, in a softly crackled leather that catches the light.",
    details: [
      "Crackle-finish calf leather upper",
      "Leather lining and sole",
      "85 mm heel",
      "Fits true to size",
      "Made in Italy",
    ],
    sizes: sizes(SHOE_SIZES, ["36", "37", "41"]),
  },
  {
    sku: "p-003",
    slug: "medici-top-handle",
    name: "Medici Top Handle",
    category: "leather-goods",
    price: 245000,
    colour: "Tan",
    stock: 0,
    image: doctorBagImage,
    gallery: [detail(doctorBagImage, "50% 30%"), lifestyle.bagCarried],
    description:
      "Our take on the physician's bag: a wide frame opening, rolled handles and buckled side straps, in a tan leather that deepens with wear.",
    details: [
      "Vegetable-tanned bridle leather",
      "Antique brass buckles and feet",
      "Twin rolled top handles",
      "Suede-lined interior with slip pocket",
      "W 34 × H 24 × D 15 cm",
      "Made in Italy",
    ],
  },
  {
    sku: "p-004",
    slug: "double-faced-wool-coat",
    name: "Double-Faced Wool Coat",
    category: "outerwear",
    price: 320000,
    colour: "Camel",
    stock: 6,
    badge: "New",
    image: lifestyle.coatLake,
    gallery: [detail(lifestyle.coatLake, "50% 52%"), lifestyle.coatStreet],
    description:
      "An unlined coat in double-faced wool, hand-finished so every seam lies flat. Dropped shoulders and a long, straight cut make it easy to layer.",
    details: [
      "100% virgin wool",
      "Hand-sewn seams, unlined",
      "Horn buttons",
      "Relaxed fit; take your usual size",
      "Dry clean only",
      "Made in Italy",
    ],
    sizes: sizes(APPAREL_SIZES, ["XS"]),
  },
  {
    sku: "p-005",
    slug: "split-toe-derby",
    name: "Split-Toe Derby",
    category: "shoes",
    price: 98000,
    colour: "Black",
    stock: 9,
    image: derbyImage,
    gallery: [detail(derbyImage, "60% 45%"), lifestyle.heelsMotion],
    description:
      "A sculptural derby with a split toe, built on a slim last and finished with a hand-polished shine.",
    details: [
      "Polished calf leather",
      "Leather sole with rubber insert",
      "Blake-stitched construction",
      "Runs half a size large",
      "Made in Portugal",
    ],
    sizes: sizes(SHOE_SIZES),
  },
  {
    sku: "p-006",
    slug: "studio-bowling-bag",
    name: "Studio Bowling Bag",
    category: "leather-goods",
    price: 168000,
    colour: "Black",
    stock: 1,
    image: bowlingBagImage,
    gallery: [detail(bowlingBagImage, "50% 70%"), lifestyle.bagStreet],
    description:
      "A compact bowling bag in pebbled leather, with buckled handles and a two-way zip that opens wide for easy access.",
    details: [
      "Pebbled calf leather",
      "Palladium-finish hardware",
      "Two-way zip closure",
      "Removable shoulder strap",
      "W 30 × H 20 × D 16 cm",
      "Made in Italy",
    ],
  },
  {
    sku: "p-007",
    slug: "giardino-pump-100",
    name: "Giardino Pump 100",
    category: "shoes",
    price: 86000,
    colour: "Floral print",
    stock: 7,
    image: floralPumpImage,
    gallery: [detail(floralPumpImage, "55% 30%"), lifestyle.heelsStreet],
    description:
      "A pointed stiletto wrapped in a painterly floral print taken from an archive garden study.",
    details: [
      "Printed silk satin upper",
      "Leather lining and sole",
      "100 mm heel",
      "Fits true to size",
      "Made in Italy",
    ],
    sizes: sizes(SHOE_SIZES, ["40"]),
  },
  {
    sku: "p-008",
    slug: "carryall-tote",
    name: "Carryall Tote",
    category: "leather-goods",
    price: 152000,
    colour: "Cognac",
    stock: 15,
    image: toteImage,
    gallery: [detail(toteImage, "50% 55%"), lifestyle.bagCarried],
    description:
      "An unstructured tote in waxed leather, large enough for a laptop and soft enough to fold into a suitcase.",
    details: [
      "Waxed pull-up leather",
      "Raw-edge handles, 22 cm drop",
      "Detachable inner pouch",
      "W 38 × H 40 × D 12 cm",
      "Made in Italy",
    ],
  },
];

async function main() {
  const now = Date.now();

  await db.batch([
    db.delete(products),
    db.delete(categories),
    db.insert(categories).values(
      categorySeeds.map((category, index) => ({
        slug: category.slug,
        name: category.name,
        description: category.description,
        imageUrl: category.image?.src,
        imageAlt: category.image?.alt,
        featured: category.featured ?? false,
        sortOrder: index,
      })),
    ),
    db.insert(products).values(
      productSeeds.map((product, index) => ({
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        // Category ids are generated, so look them up inside the same batch.
        categoryId: sql<number>`(select ${categories.id} from ${categories} where ${categories.slug} = ${product.category})`,
        priceCents: product.price,
        stock: product.stock,
        colour: product.colour,
        description: product.description,
        details: product.details,
        imageUrl: product.image.src,
        imageAlt: product.image.alt,
        gallery: product.gallery,
        sizes: product.sizes,
        badge: product.badge,
        // One minute apart, newest first.
        createdAt: new Date(now - index * 60_000),
      })),
    ),
  ]);

  console.log(
    `Seeded ${categorySeeds.length} categories and ${productSeeds.length} products.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
