import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StockStatus } from "@/components/stock-status";
import { formatPrice, getStockState, type Product } from "@/lib/catalog";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return {
    title: `${product.name} | Atelier Store`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <div className="mx-auto max-w-page lg:grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProductGallery images={[product.image, ...product.gallery]} />
          </div>
          <div className="lg:col-span-5">
            {/* Information stays in view while the gallery scrolls. */}
            <div className="px-gutter pt-6 pb-section lg:sticky lg:top-masthead lg:px-12 lg:pt-10 xl:px-16">
              <ProductInformation product={product} />
            </div>
          </div>
        </div>
        <RelatedProducts product={product} />
      </main>
      <SiteFooter />
    </>
  );
}

function ProductInformation({ product }: { product: Product }) {
  const stock = getStockState(product);
  const soldOut = stock.status === "sold-out";

  return (
    <div className="stack">
      <nav aria-label="Breadcrumb">
        <ol className="cluster gap-2 text-caption text-muted">
          <li>
            <Link href="/" className="link-muted">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/#new-in" className="link-muted">
              {product.category}
            </Link>
          </li>
        </ol>
      </nav>

      <p className="mt-8 text-label text-muted">{product.category}</p>
      <h1 className="mt-3 text-heading">{product.name}</h1>
      <p className="mt-4 text-lead">{formatPrice(product.price)}</p>

      <div className="mt-6 stack gap-2 border-t pt-6">
        <p className="text-body">
          <span className="text-muted">Colour</span>{" "}
          <span className="text-ink">{product.colour}</span>
        </p>
        <StockStatus stock={stock} />
      </div>

      {product.sizes ? (
        <SizePicker product={product} disabled={soldOut} />
      ) : null}

      {/* Bag and notifications are not wired up yet: there is no cart. */}
      <div className="mt-8 stack gap-3">
        {soldOut ? (
          <>
            <button type="button" className="btn btn-primary w-full" disabled>
              Sold out
            </button>
            <button type="button" className="btn btn-secondary w-full">
              Notify me when available
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary w-full">
            Add to bag
          </button>
        )}
      </div>

      <ul className="mt-6 stack gap-2 text-caption text-muted">
        <li>Complimentary express shipping and returns</li>
        <li>
          <Link href="#" className="link-underline">
            Book an appointment
          </Link>{" "}
          to see this piece in a boutique
        </li>
      </ul>

      <p className="mt-10 text-body text-ink-soft">{product.description}</p>

      <div className="mt-8 border-b">
        <Disclosure title="Details & composition" defaultOpen>
          <ul className="stack gap-1.5">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <p className="mt-4 text-caption text-subtle">Style {product.sku}</p>
        </Disclosure>
        <Disclosure title="Shipping & returns">
          <p>
            Complimentary express delivery in 2–4 business days, presented in
            our signature packaging. Return or exchange within 30 days with a
            free collection from your door.
          </p>
        </Disclosure>
        <Disclosure title="Care">
          <p>
            Store in the dust bag provided, away from direct sunlight. Our
            artisans offer cleaning, conditioning and repairs for the lifetime
            of the piece.
          </p>
        </Disclosure>
      </div>
    </div>
  );
}

/* Native radio group: no client JavaScript, keyboard support for free. */
function SizePicker({
  product,
  disabled,
}: {
  product: Product;
  disabled: boolean;
}) {
  const sizes = product.sizes ?? [];

  return (
    <fieldset className="mt-8" disabled={disabled}>
      <div className="flex items-baseline justify-between">
        <legend className="text-label">Size</legend>
        <Link href="#" className="link text-caption text-muted">
          Size guide
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
        {sizes.map((size) => (
          <label
            key={size.label}
            className="flex h-control cursor-pointer items-center justify-center border text-body transition-colors hover:border-ink has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-disabled:cursor-not-allowed has-disabled:text-subtle has-disabled:line-through has-disabled:hover:border-line has-focus-visible:outline has-focus-visible:outline-offset-2"
          >
            <input
              type="radio"
              name="size"
              value={size.label}
              disabled={!size.available}
              className="sr-only"
            />
            {size.label}
            {size.available ? null : <span className="sr-only">, sold out</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Disclosure({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="group border-t" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-label [&::-webkit-details-marker]:hidden">
        {title}
        <span
          aria-hidden="true"
          className="relative size-3 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-ink after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-ink after:transition-transform group-open:after:scale-y-0"
        />
      </summary>
      <div className="pb-6 text-body text-ink-soft">{children}</div>
    </details>
  );
}

async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product.id, product.categorySlug);

  return (
    <section className="section border-t">
      <div className="container-page">
        <SectionHeader
          eyebrow="Complete the look"
          title="You May Also Like"
          href="/#new-in"
          linkLabel="View all"
        />
      </div>
      <div className="mx-auto max-w-page sm:px-gutter">
        <div className="grid-products">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
