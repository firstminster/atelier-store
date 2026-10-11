import Image from "next/image";

import type { GalleryImage } from "@/lib/catalog";

/*
 * Phones: swipeable row with the next image peeking in.
 * lg+: first image full width, the rest in a two-up grid below it.
 */
export function ProductGallery({ images }: { images: GalleryImage[] }) {
  return (
    <ul
      aria-label="Product images"
      className="flex snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:overflow-visible"
    >
      {images.map((image, index) => (
        <li
          key={`${image.src}-${index}`}
          className={`w-[88%] shrink-0 snap-start sm:w-[60%] lg:w-auto ${index === 0 ? "lg:col-span-2" : ""}`}
        >
          <div className="media-frame aspect-portrait">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes={
                index === 0
                  ? "(min-width: 64rem) 58vw, (min-width: 40rem) 60vw, 88vw"
                  : "(min-width: 64rem) 29vw, (min-width: 40rem) 60vw, 88vw"
              }
              className={image.detailFocus ? "scale-[1.8]" : undefined}
              style={
                image.detailFocus
                  ? { transformOrigin: image.detailFocus }
                  : undefined
              }
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
