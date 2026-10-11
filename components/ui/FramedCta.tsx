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

type Own = {
  label: string;
  /** What a screen reader hears, when the visible label is the shorter form. */
  ariaLabel?: string;
  /** The frame is hidden under 768px in the header; this keeps it. */
  wide?: boolean;
};

type Props = Omit<ComponentProps<typeof Link>, "children" | "aria-label"> & Own;

type ButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & Own;

const classes = (wide?: boolean, className?: string) =>
  `nav-cta${wide ? " nav-cta--wide" : ""}${className ? ` ${className}` : ""}`;

/** The inside of the control, shared by the link and the button. */
function Face({ label }: { label: string }) {
  return (
    <>
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
    </>
  );
}

/**
 * The framed call — corner marks, a label that rolls up as its double arrives
 * from below, and the one solid steel square on the page carrying an arrow that
 * leaves on the diagonal.
 *
 * The site's one call to action: the header's CONTACT, and every other link or
 * button that moves the visitor on, are this same control rather than several
 * that resemble each other.
 */
export function FramedCta({ label, ariaLabel, wide, className, ...props }: Props) {
  return (
    <Link {...props} aria-label={ariaLabel ?? label} className={classes(wide, className)}>
      <Face label={label} />
    </Link>
  );
}

/** The same control where the action submits rather than navigates. */
export function FramedCtaButton({ label, ariaLabel, wide, className, ...props }: ButtonProps) {
  return (
    <button {...props} aria-label={ariaLabel ?? label} className={classes(wide, className)}>
      <Face label={label} />
    </button>
  );
}
