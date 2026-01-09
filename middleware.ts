/**
 * Next.js Middleware for CSP Nonce Injection
 *
 * This middleware generates a unique nonce for each request and injects it
 * into the response headers. The nonce is used to secure inline scripts
 * against XSS attacks.
 *
 * IMPORTANT: This middleware only works when NOT using `output: "export"`.
 * For static exports, CSP must be configured at the deployment platform level.
 *
 * @created 2026-01-09
 */

import { type NextRequest, NextResponse } from "next/server";
import { buildCspHeader, generateNonce } from "@/lib/csp-config";

export function middleware(request: NextRequest) {
  // Generate a unique nonce for this request
  const nonce = generateNonce();

  // Build CSP header with the nonce (not static export since middleware is running)
  const cspHeader = buildCspHeader(nonce, false);

  // Clone the request headers and add the nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // Create response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set CSP header on response
  response.headers.set("Content-Security-Policy", cspHeader);

  // Additional security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // HSTS - only in production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - API routes (they handle their own headers)
     */
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
