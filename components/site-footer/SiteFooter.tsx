import Link from "next/link";

const PAGES = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * The room the lights come up in. It sits under the whole page — stuck to the
 * bottom of the window the entire way down, hidden behind the opaque panel — and
 * is uncovered as the last section clears the bottom edge. The mirror of the hero,
 * which is stuck to the top and covered from below.
 *
 * Ivory ground, black ink: the only inversion on the site, and the last thing seen.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-label font-mono">Info</p>
            <p className="footer-item">Madagascar</p>
            <p className="footer-item">Editor · Sound designer</p>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <p className="footer-label font-mono">Pages</p>
            {PAGES.map((page) => (
              <Link key={page.href} href={page.href} className="footer-item footer-link">
                {page.label}
              </Link>
            ))}
          </nav>

          <p className="footer-credit font-mono">
            © {new Date().getFullYear()} Aly Sanoo — All rights reserved
          </p>
        </div>

        {/* The name, cut out of the opening frame. */}
        <p className="footer-wordmark font-title">Aly Sanoo</p>
      </div>
    </footer>
  );
}
