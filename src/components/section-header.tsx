import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
      <div>
        <p className="text-label text-muted">{eyebrow}</p>
        <h2 className="mt-3 text-heading">{title}</h2>
      </div>
      {href && linkLabel ? (
        <Link href={href} className="link text-label inline-flex items-center gap-2 self-start sm:self-auto">
          {linkLabel}
          <ArrowRightIcon />
        </Link>
      ) : null}
    </div>
  );
}
