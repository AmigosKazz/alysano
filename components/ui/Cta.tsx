import Link from "next/link";
import type { ComponentProps } from "react";

/** Drawn twice inside the accent square so one can roll out as the other arrives. */
function Arrow() {
  return (
    <svg width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
      <path
        d="M0 4.5h11M8 1l3.5 3.5L8 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
      />
    </svg>
  );
}

type Props = ComponentProps<typeof Link> & { label: string };

/**
 * The page's forward action, carrying the same steel-blue square as the header's
 * CONTACT call. Shared so every one of them stays the same control.
 */
export function Cta({ label, ...props }: Props) {
  return (
    <Link {...props} className="cta font-mono">
      <span className="cta-label">{label}</span>
      <span className="cta-arrow" aria-hidden="true">
        <Arrow />
        <Arrow />
      </span>
    </Link>
  );
}
