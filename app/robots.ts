import type { MetadataRoute } from "next";

/**
 * Everything is open to be found except the rate flow's own pages — the
 * approval and the magic link carry a signed token in their address, and none
 * of them is anything a search result should lead to. The pages also say
 * `noindex` themselves; this keeps well-behaved crawlers from asking at all.
 *
 * The service pages stay crawlable on purpose: what a discipline covers is
 * public. The figures never are, so there is nothing on them to protect.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/rates/" },
  };
}
