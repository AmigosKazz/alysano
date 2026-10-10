/**
 * The shape of a rate and the way it reads — and nothing else. No figure is
 * written here: the figures live in `lib/rates.server.ts` and never leave the
 * server, so this module is safe to import from anywhere, the rate card
 * included.
 */

export type Price =
  /** `from` marks the rates the documents wrote with a trailing "+". */
  | { kind: "amount"; ar: number; from?: boolean }
  | { kind: "quote" }
  | { kind: "none" };

/** One row of a rate card: a price per tier, in the order of its `tiers`. */
export type Prices = readonly [Price, Price, Price];

/**
 * Ariary, grouped in threes and cut to millions past a million — the way the
 * source documents read them. `from` is carried by the page, not the number,
 * so "from" can be said once for a whole column rather than on every cell.
 */
export function formatPrice(price: Price): string {
  if (price.kind === "quote") return "On request";
  if (price.kind === "none") return "—";

  const { ar: amount } = price;
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const written = Number.isInteger(millions) ? String(millions) : millions.toFixed(1);
    return `${written} M Ar`;
  }
  return `${amount.toLocaleString("en-US").replace(/,/g, " ")} Ar`;
}

export type Discount =
  | { kind: "percent"; off: number }
  /** The first step of a pack: no discount, the rate as listed. */
  | { kind: "unit" }
  | { kind: "quote" };

export const formatDiscount = (discount: Discount): string =>
  discount.kind === "percent"
    ? `−${discount.off}%`
    : discount.kind === "unit"
      ? "Unit rate"
      : "On request";
