import Link from "next/link";

const footerColumns = [
  {
    title: "Client Services",
    links: ["Contact us", "Shipping", "Returns", "Track an order", "FAQ"],
  },
  {
    title: "The House",
    links: ["Our story", "Craftsmanship", "Sustainability", "Careers"],
  },
  {
    title: "Boutiques",
    links: ["Find a boutique", "Book an appointment", "Repairs & care"],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="container-page grid gap-12 py-section lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-label">Newsletter</h2>
          <p className="mt-4 max-w-sm text-body text-muted">
            Receive early access to new collections, private events and stories
            from the atelier.
          </p>
          {/* Not wired up yet: there is no subscription endpoint. */}
          <form className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Email address"
              className="h-control flex-1 border border-line-strong bg-paper px-4 text-body placeholder:text-subtle"
            />
            <button type="button" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-label">{column.title}</h2>
              <ul className="mt-5 stack gap-3">
                {column.links.map((label) => (
                  <li key={label}>
                    <Link href="#" className="link-muted text-body">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-3 py-6 text-caption text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Atelier. All rights reserved.</p>
          <ul className="cluster gap-x-6 gap-y-2">
            {["Privacy", "Terms", "Accessibility", "Cookies"].map((label) => (
              <li key={label}>
                <Link href="#" className="link-muted">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
