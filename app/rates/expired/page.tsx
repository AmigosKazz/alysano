import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Link lapsed — Aly Sanoo",
  robots: { index: false, follow: false },
};

/** Where an access link lands when it can no longer be used. */
export default function ExpiredPage() {
  return (
    <main>
      <div className="page-cover">
        <section className="approve">
          <p className="service-page-back font-mono">Rates</p>
          <h1 className="approve-title font-title">Link lapsed</h1>
          <p className="rates-gate-line">
            This link has expired, or is no longer valid. Ask again on the page of the service and a
            new one will follow. <Link href="/services">Back to services</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
