import Link from "next/link";

import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileMenu } from "@/components/mobile-menu";
import { primaryNav } from "@/components/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-sm">
      <p className="truncate bg-ink px-gutter py-2 text-center text-label text-paper">
        Complimentary shipping &amp; returns
      </p>

      <div className="container-page grid h-header grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center">
          <div className="lg:hidden">
            <MobileMenu />
          </div>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="cluster gap-x-7">
              {primaryNav.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="link text-label">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link
          href="/"
          aria-label="Atelier home"
          className="font-serif text-2xl tracking-[0.32em] uppercase lg:text-[2rem]"
        >
          Atelier
        </Link>

        <div className="flex items-center justify-end gap-1 -mr-2.5">
          <button type="button" className="btn-icon" aria-label="Search">
            <SearchIcon />
          </button>
          <Link href="#" className="btn-icon max-sm:hidden" aria-label="Account">
            <UserIcon />
          </Link>
          <Link href="#" className="btn-icon relative" aria-label="Shopping bag, 0 items">
            <BagIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}
