import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { editorial, heroImages } from "@/lib/catalog";
import { getFeaturedCollections, getNewArrivals } from "@/lib/products";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <NewArrivals />
        <EditorialFeature />
        <FeaturedCollections />
        <CampaignBanner />
        <Services />
      </main>
      <SiteFooter />
    </>
  );
}

/*
 * Full-bleed diptych: one image on mobile, two side by side from md.
 * Height fills the viewport below the sticky header (announcement bar + nav).
 */
function Hero() {
  return (
    <section className="relative h-[calc(100svh-var(--spacing-masthead))] min-h-[32rem]">
      <div className="absolute inset-0 grid md:grid-cols-2">
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`media-frame ${index === 1 ? "max-md:hidden" : ""}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              sizes="(min-width: 48rem) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-ink/55 via-ink/5 to-transparent" />

      <div className="relative container-page flex h-full flex-col items-center justify-end pb-14 text-center text-paper lg:pb-20">
        <p className="text-label">Autumn–Winter 2026</p>
        <h1 className="mt-4 text-display">The Quiet Hour</h1>
        <p className="mt-4 max-w-md text-lead text-paper/85">
          A collection of softened tailoring and sculpted leather, made for the
          hours between day and night.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="#new-in" className="btn btn-inverse">
            Shop the collection
          </Link>
          <Link
            href="#stories"
            className="btn border-paper text-paper hover:bg-paper hover:text-ink"
          >
            Watch the film
          </Link>
        </div>
      </div>
    </section>
  );
}

async function NewArrivals() {
  const newArrivals = await getNewArrivals();

  return (
    <section id="new-in" className="section scroll-mt-masthead">
      <div className="container-page">
        <SectionHeader
          eyebrow="Just arrived"
          title="New In"
          href="#"
          linkLabel="View all"
        />
      </div>
      {/* Edge-to-edge on phones, gutters from sm. */}
      <div className="mx-auto max-w-page sm:px-gutter">
        <div className="grid-products">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* Large image paired with a short story, text column on the right. */
function EditorialFeature() {
  return (
    <section id="stories" className="scroll-mt-masthead bg-surface">
      <div className="mx-auto grid max-w-page lg:grid-cols-12">
        <div className="media-frame aspect-editorial md:aspect-square lg:col-span-7 lg:aspect-auto lg:min-h-[48rem]">
          <Image
            src={editorial.feature.src}
            alt={editorial.feature.alt}
            fill
            sizes="(min-width: 64rem) 60vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center px-gutter py-section lg:col-span-5 lg:px-16 xl:px-24">
          <p className="text-label text-muted">The Atelier Journal</p>
          <h2 className="mt-4 text-heading">Oxblood, Reconsidered</h2>
          <p className="mt-6 max-w-text text-lead text-ink-soft">
            Our studio revisits the deep red of archive linings, now cut into
            double-breasted blazers and gauntlet gloves. Shot in the stairwells
            of a modernist library, the season&apos;s most decisive colour finds
            its quiet register.
          </p>
          <div className="mt-10">
            <Link href="#" className="btn btn-secondary">
              Read the story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

async function FeaturedCollections() {
  const collections = await getFeaturedCollections();

  return (
    <section id="collections" className="section scroll-mt-masthead">
      <div className="container-page">
        <SectionHeader eyebrow="Featured" title="The Collections" />
        {/* Swipeable row on phones (bleeds to the screen edge), grid from md. */}
        <ul className="-mx-gutter flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-px-gutter px-gutter [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {collections.map((collection) => (
            <li
              key={collection.slug}
              className="group relative w-[78%] shrink-0 snap-start md:w-auto"
            >
              <div className="media-frame aspect-portrait">
                <Image
                  src={collection.image.src}
                  alt={collection.image.alt}
                  fill
                  sizes="(min-width: 48rem) 33vw, 80vw"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 stack items-center gap-2 text-center">
                <h3 className="text-title font-serif">{collection.name}</h3>
                <p className="text-body text-muted">{collection.description}</p>
                <Link
                  href="#"
                  className="link mt-2 text-label after:absolute after:inset-0"
                >
                  Explore
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Full-bleed campaign image with the copy set on top. */
function CampaignBanner() {
  return (
    <section className="relative h-[80svh] min-h-[28rem]">
      <div className="media-frame absolute inset-0">
        <Image
          src={editorial.campaign.src}
          alt={editorial.campaign.alt}
          fill
          sizes="100vw"
          className="object-[50%_80%]"
        />
      </div>
      <div className="absolute inset-0 bg-ink/25" />
      <div className="relative container-text flex h-full flex-col items-center justify-center text-center text-paper">
        <p className="text-label">Resort 2027 Preview</p>
        <h2 className="mt-4 text-display">Saffron Light</h2>
        <div className="mt-8">
          <Link href="#" className="btn btn-inverse">
            Discover
          </Link>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    title: "Complimentary Shipping",
    body: "Express delivery on every order, wrapped in our signature box.",
  },
  {
    title: "Returns Within 30 Days",
    body: "Return or exchange any piece, collected from your door.",
  },
  {
    title: "Personal Appointments",
    body: "Book a private session in a boutique or by video call.",
  },
  {
    title: "Care & Repairs",
    body: "Our artisans restore leather goods for a lifetime of wear.",
  },
];

function Services() {
  return (
    <section className="border-t">
      <div className="container-page">
        {/* 1px gaps over a line-coloured background draw the inner hairlines. */}
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.title} className="bg-paper px-6 py-10 text-center">
              <h3 className="text-label">{service.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-body text-muted">
                {service.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
