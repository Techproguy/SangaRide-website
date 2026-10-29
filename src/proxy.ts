import { NextResponse, type NextRequest } from "next/server";
import { portalPaths } from "@/lib/fleet-portal";

// Reject unknown preview routes before Partial Prerendering sends HTTP headers.
// This is routing validation, not authentication or an authorization boundary.
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
    .slice("/fleet/portal".length)
    .replace(/^\/|\/$/g, "");
  if (portalPaths.includes(path)) return NextResponse.next();

  return new NextResponse(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Sanga Ride</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#fafcff;color:#000d38;font:16px system-ui;text-align:center"><main style="padding:32px"><h1>Page not found</h1><p>This fleet portal page does not exist.</p><a href="/fleet/portal/login" style="color:#1550f0">Return to the fleet portal</a></main></body></html>',
    {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    },
  );
}

export const config = { matcher: "/fleet/portal/:path*" };
