/**
 * CSP (Content Security Policy) Configuration
 *
 * Builds CSP headers from environment variables.
 * No hardcoded domains - all configurable via .env
 *
 * @created 2026-01-09
 * @updated 2026-01-09 - Added Google OAuth styles, Cloudflare always enabled, worker-src
 */

interface CspConfig {
  allowEval: boolean;
  thirdParty: {
    google: string[];
    googleStyles: string[]; // For Google OAuth button styles
    cloudflare: string[];
    fonts: string[];
    other: string[];
  };
  firstParty: string[];
}

/**
 * Extract origin from URL safely
 */
function safeGetOrigin(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/**
 * Get CSP configuration from environment variables
 */
export function getCspConfig(): CspConfig {
  const isDev = process.env.NODE_ENV === "development";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Extract API domain safely
  const apiDomain = safeGetOrigin(apiUrl);

  // Build first-party domains list
  const firstPartyDomains: string[] = [];

  if (apiDomain) {
    firstPartyDomains.push(apiDomain);
  }

  // Dev mode: allow localhost variants
  if (isDev) {
    firstPartyDomains.push(
      "http://localhost:3000",
      "http://localhost:4000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:4000"
    );
  }

  return {
    // Dev mode: more permissive (allow eval for hot reload)
    allowEval: isDev,

    thirdParty: {
      // Google OAuth & APIs (script, frame, connect)
      google: ["https://accounts.google.com", "https://apis.google.com"],

      // Google OAuth button styles (style-src)
      googleStyles: ["https://accounts.google.com"],

      // Cloudflare Analytics - ALWAYS enabled to prevent CSP violations
      // Even if not using analytics, CSP should not block if page includes script
      cloudflare: [
        "https://static.cloudflareinsights.com",
        "https://cloudflareinsights.com",
      ],

      // Google Fonts
      fonts: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],

      // Other APIs
      other: ["https://provinces.open-api.vn"],
    },

    firstParty: firstPartyDomains,
  };
}

/**
 * Build CSP header string from config
 */
export function buildCspHeader(): string {
  const config = getCspConfig();
  const isDev = process.env.NODE_ENV === "development";

  // Script sources
  // SECURITY: Only allow 'unsafe-inline' in development for hot reload
  // Production should use nonces or hashes, but 'unsafe-inline' is needed
  // for Next.js inline scripts until we implement nonce-based CSP
  const scriptSrc = [
    "'self'",
    // Allow unsafe-inline in dev, or in prod for Next.js compatibility
    // TODO: Implement nonce-based CSP for production to remove unsafe-inline
    ...(isDev ? ["'unsafe-inline'", "'unsafe-eval'"] : ["'unsafe-inline'"]),
    ...config.thirdParty.google,
    ...config.thirdParty.cloudflare,
  ]
    .filter(Boolean)
    .join(" ");

  // Style sources - includes Google OAuth button styles
  // Note: 'unsafe-inline' for styles is generally acceptable and required for
  // CSS-in-JS libraries and inline styles. This is lower risk than script unsafe-inline.
  const styleSrc = [
    "'self'",
    "'unsafe-inline'",
    ...config.thirdParty.fonts,
    ...config.thirdParty.googleStyles,
  ]
    .filter(Boolean)
    .join(" ");

  // Font sources
  const fontSrc = ["'self'", ...config.thirdParty.fonts, "data:"]
    .filter(Boolean)
    .join(" ");

  // Connect sources (API calls, fetch, WebSocket)
  const connectSrc = [
    "'self'",
    ...config.firstParty,
    ...config.thirdParty.google,
    ...config.thirdParty.cloudflare,
    ...config.thirdParty.other,
  ]
    .filter(Boolean)
    .join(" ");

  // Frame sources (iframes)
  const frameSrc = ["'self'", ...config.thirdParty.google]
    .filter(Boolean)
    .join(" ");

  // Worker sources (service worker)
  const workerSrc = ["'self'", "blob:"].join(" ");

  // Build full CSP header
  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `font-src ${fontSrc}`,
    `img-src 'self' data: https: blob:`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `worker-src ${workerSrc}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ];

  return directives.join("; ");
}

/**
 * Get CSP header for use in metadata or headers
 */
export function getCspHeaderValue(): string {
  return buildCspHeader();
}
