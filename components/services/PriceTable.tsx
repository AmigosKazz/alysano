"use client";

import { useId, useState } from "react";
import { formatPrice, type Catalogue } from "@/lib/services";

/**
 * A rate card. One row per piece of work, one column per tier.
 *
 * On a phone three price columns cannot be read side by side, so the same table
 * keeps all three in the markup and shows one at a time — the tier is chosen
 * with a real radio group, and the change is announced. Nothing is hidden from
 * a screen reader: the columns it is not showing are still in the document,
 * carried by the caption and the row headers.
 */
export function PriceTable({ catalogue }: { catalogue: Catalogue }) {
  const [tier, setTier] = useState<number>(catalogue.recommended ?? 0);
  const name = useId();

  // A group label is only printed when it changes, so the eye gets landmarks
  // down a long table without a heading on every line. Worked out up front
  // rather than while mapping: the render stays a pure read of the data.
  const lines = catalogue.rows.map((row, i) => ({
    row,
    heading: row.group && row.group !== catalogue.rows[i - 1]?.group ? row.group : null,
  }));

  return (
    <div className="rates" id={catalogue.id}>
      <div className="rates-head">
        <h3 className="rates-title font-title">{catalogue.title}</h3>
        {catalogue.note ? <p className="rates-note">{catalogue.note}</p> : null}
      </div>

      {/* Phone only: which column the table is showing. */}
      <div className="rates-switch" role="radiogroup" aria-label={`${catalogue.title} — tier`}>
        {catalogue.tiers.map((label, i) => (
          <label key={label} className="rates-switch-option font-mono" data-on={i === tier}>
            <input
              type="radio"
              name={name}
              checked={i === tier}
              onChange={() => setTier(i)}
              className="sr-only"
            />
            {label}
          </label>
        ))}
      </div>

      <table className="rates-table" data-tier={tier}>
        <caption className="sr-only">
          {catalogue.title} — rates in ariary by tier
        </caption>
        <thead>
          <tr>
            <th scope="col">Work</th>
            {catalogue.tiers.map((label, i) => (
              <th
                key={label}
                scope="col"
                className="font-mono"
                data-col={i}
                data-recommended={i === catalogue.recommended ? "true" : undefined}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody aria-live="polite">
          {lines.map(({ row, heading }) => (
            <tr key={row.label} data-group-start={heading ? "true" : undefined}>
              <th scope="row">
                {heading ? <span className="rates-group font-mono">{heading}</span> : null}
                {row.label}
              </th>
              {row.prices.map((price, i) => (
                <td key={i} className="font-mono" data-col={i} data-kind={price.kind}>
                  {formatPrice(price)}
                  {price.kind === "amount" && price.from ? (
                    <span className="rates-from" aria-label="and up">
                      +
                    </span>
                  ) : null}
                  {price.kind === "none" ? (
                    <span className="sr-only">not offered at this tier</span>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {catalogue.onRequest?.length ? (
        <p className="rates-request">
          <span className="font-mono">On request —</span> {catalogue.onRequest.join(", ")}.
        </p>
      ) : null}
    </div>
  );
}
