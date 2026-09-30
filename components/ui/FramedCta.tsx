import Link from "next/link";
import type { ComponentProps } from "react";

/** Drawn twice inside the accent square so one can roll out as the other arrives. */
function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.6 9.4 9.4 2.6M4.3 2.6h5.1v5.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="square"
      />
    </svg>
  );
}

type Props = Omit<ComponentProps<typeof Link>, "children" | "aria-label"> & {
  label: string;
  /** What a screen reader hears, when the visible label is the shorter form. */
  ariaLabel?: string;
  /** The frame is hidden under 768px in the header; this keeps it. */
  wide?: boolean;
};

/**
 * The framed call — corner marks, a label that rolls up as its double arrives
 * from below, and the one solid steel square on the page carrying an arrow that
 * leaves on the diagonal.
 *
 * Shared so the header's CONTACT and the services stage's rate link are the
 * same control rather than two that resemble each other.
 */
export function FramedCta({ label, ariaLabel, wide, className, ...props }: Props) {
  return (
    <Link
      {...props}
      aria-label={ariaLabel ?? label}
      className={`nav-cta${wide ? " nav-cta--wide" : ""}${className ? ` ${className}` : ""}`}
    >
      <span className="nav-cta-frame">
        <i className="nav-cta-corners" aria-hidden="true" />
        <span
          className="nav-cta-roll font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-ivory md:text-[11px]"
          aria-hidden="true"
        >
          <span>{label}</span>
          <span>{label}</span>
        </span>
      </span>
      <span className="nav-cta-arrow">
        <Arrow />
        <Arrow />
      </span>
    </Link>
  );
}
