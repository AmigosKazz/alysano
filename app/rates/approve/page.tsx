import type { Metadata } from "next";
import Link from "next/link";
import { ApproveForm } from "@/components/services/ApproveForm";
import { verifyToken } from "@/lib/rates/token";
import { categoryBySlug } from "@/lib/services";

export const metadata: Metadata = {
  title: "Approve a request — Aly Sanoo",
  robots: { index: false, follow: false },
  // The token is in this address; nothing on the page should carry it onward.
  referrer: "no-referrer",
};

/**
 * Where the link in a request email lands. Opening it grants nothing — mail
 * scanners open every link they are sent — it only shows who is asking and for
 * what, with one button. The grant happens in `approveRates`, on that click.
 */
export default async function ApprovePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { t } = await searchParams;
  const token = typeof t === "string" ? t : "";
  const verified = token ? await verifyToken("approve", token) : null;

  const claims = verified?.ok ? verified.claims : null;
  const service = claims ? categoryBySlug(claims.from) : null;
  const covers =
    claims?.scope === "all"
      ? "Every service"
      : claims?.scope.map((slug) => categoryBySlug(slug)?.name ?? slug).join(", ");

  return (
    <main>
      <div className="page-cover">
        <section className="approve">
          <p className="service-page-back font-mono">Rates · Approval</p>

          {claims ? (
            <>
              <h1 className="approve-title font-title">{claims.name}</h1>
              <dl className="approve-summary font-mono">
                <div>
                  <dt>Email</dt>
                  <dd>{claims.email}</dd>
                </div>
                {claims.company ? (
                  <div>
                    <dt>Company</dt>
                    <dd>{claims.company}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>Asked about</dt>
                  <dd>{service?.name ?? claims.from}</dd>
                </div>
                <div>
                  <dt>Would see</dt>
                  <dd>{covers}</dd>
                </div>
              </dl>

              <p className="rates-gate-line">
                Confirming sends them a link that opens the rates in their browser for 30 days.
                Nothing is shared before that.
              </p>
              <ApproveForm token={token} />
            </>
          ) : (
            <>
              <h1 className="approve-title font-title">Link lapsed</h1>
              <p className="rates-gate-line">
                {verified && !verified.ok && verified.reason === "expired"
                  ? "This approval link has expired. A request lasts 14 days."
                  : "This link is not valid."}{" "}
                <Link href="/services">Back to services</Link>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
