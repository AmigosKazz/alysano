import { RatesRequestForm } from "./RatesRequestForm";
import type { RatesAccess } from "@/lib/rates/access";

/** 11.10.2026 — day first, the way the rest of the page writes a date. */
const day = (date: Date) =>
  [date.getUTCDate(), date.getUTCMonth() + 1]
    .map((n) => String(n).padStart(2, "0"))
    .concat(String(date.getUTCFullYear()))
    .join(".");

/** The address, kept just recognisable: h•••@gmail.com. */
const veil = (email: string) => {
  const at = email.lastIndexOf("@");
  return at < 1 ? "your address" : `${email[0]}•••${email.slice(at)}`;
};

/**
 * What stands where the figures will be: where the visitor is with them, said
 * in one line, and the one thing they can do about it.
 *
 * It only ever reads a state — the decision was taken by `getRatesAccess`, on
 * the server, before anything was rendered.
 */
export function RatesGate({
  slug,
  access,
}: {
  slug: string;
  access: RatesAccess;
}) {
  return (
    <section id="rates" className="rates-gate" aria-label="Rates access">
      {access.state === "granted" ? (
        <p className="rates-gate-meta font-mono" role="status">
          [ Access · {access.scope === "all" ? "All services" : "This service"} · Until{" "}
          {day(access.until)} ]
        </p>
      ) : null}

      {access.state === "pending" ? (
        <>
          <p className="rates-gate-meta font-mono" role="status">
            [ Request received · {day(access.since)} ]
          </p>
          <p className="rates-gate-line">
            Your request is being reviewed. A link to the rates will reach{" "}
            {veil(access.email)} once it is approved.
          </p>
        </>
      ) : null}

      {access.state === "none" || access.state === "expired" ? (
        <>
          <p className="rates-gate-meta font-mono">
            [ {access.state === "expired" ? "Access ended" : "Rates on request"} ]
          </p>
          <p className="rates-gate-line">
            {access.state === "expired"
              ? "Your access to the rates has ended. Ask again and a new link will follow."
              : "What this covers is open to read. The rates are shared with whoever asks — each request is read, and answered by hand."}
          </p>
          <RatesRequestForm slug={slug} />
        </>
      ) : null}
    </section>
  );
}
