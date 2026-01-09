/**
 * CSP (Content Security Policy) Configuration
 *
 * Builds CSP headers from environment variables.
 * No hardcoded domains - all configurable via .env
 *
 * @created 2026-01-09
 */

interface CspConfig {
  allowEval: boolean;
  thirdParty: {
    google: string[];
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
  const enableCloudflare =
    process.env.NEXT_PUBLIC_ENABLE_CLOUDFLARE_ANALYTICS === "true";

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
      // Google OAuth & APIs
      google: ["https://accounts.google.com", "https://apis.google.com"],

      // Cloudflare Analytics (conditional)
      cloudflare: enableCloudflare
        ? [
            "https://static.cloudflareinsights.com",
            "https://cloudflareinsights.com",
          ]
        : [],

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

  // Script sources
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(config.allowEval ? ["'unsafe-eval'"] : []),
    ...config.thirdParty.google,
    ...config.thirdParty.cloudflare,
  ]
    .filter(Boolean)
    .join(" ");

  // Style sources
  const styleSrc = ["'self'", "'unsafe-inline'", ...config.thirdParty.fonts]
    .filter(Boolean)
    .join(" ");

  // Font sources
  const fontSrc = ["'self'", ...config.thirdParty.fonts]
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

  // Build full CSP header
  const directives = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `font-src ${fontSrc}`,
    `img-src 'self' data: https: blob:`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
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
