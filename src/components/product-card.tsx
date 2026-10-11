import Image from "next/image";
import Link from "next/link";

import { formatPrice, getStockState, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const stock = getStockState(product);
  const soldOut = stock.status === "sold-out";
  const badge = soldOut ? stock.label : product.badge;

  return (
    <article className="group relative">
      <div className="media-frame aspect-portrait">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw"
          className={`transition-transform duration-700 group-hover:scale-[1.03] ${soldOut ? "opacity-60" : ""}`}
        />
        {badge ? (
          <span className="absolute top-3 left-3 bg-paper px-2 py-1 text-label">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 stack gap-1 px-1 sm:px-0">
        <p className="text-caption text-muted">{product.category}</p>
        <h3 className="text-body">
          {/* Stretched link: the whole card is clickable. */}
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-body text-ink-soft">{formatPrice(product.price)}</p>
        {stock.status === "low-stock" ? (
          <p className="text-caption text-warning">{stock.label}</p>
        ) : null}
      </div>
    </article>
  );
}
