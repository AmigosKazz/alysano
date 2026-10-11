import { NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/rates/mail";
import { redeemAccess } from "@/lib/rates/access";
import { categoryBySlug } from "@/lib/services";

/**
 * The magic link. A valid token becomes the visitor's cookie, and they are
 * sent on to the rates — the address they land on has no token in it.
 *
 * It can be opened more than once and by anything: a mail scanner following it
 * only sets a cookie in its own session. Nothing here is consumed.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const redeemed = token ? await redeemAccess(token) : null;

  const path = redeemed?.ok
    ? categoryBySlug(redeemed.from)
      ? `/services/${redeemed.from}#rates`
      : "/services"
    : "/rates/expired";

  const response = NextResponse.redirect(new URL(path, siteUrl()), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex");
  return response;
}
