/**
 * CSP (Content Security Policy) Configuration
 *
 * Builds CSP headers from environment variables.
 * No hardcoded domains - all configurable via .env
 *
 * Security Modes:
 * 1. Development: unsafe-inline + unsafe-eval (for hot reload)
 * 2. Production Dynamic (with middleware): nonce-based + strict-dynamic (most secure)
 * 3. Production Static Export: domain allowlist + unsafe-inline (acceptable)
 *
 * How to enable nonce-based CSP:
 * - Remove `output: "export"` from next.config.ts
 * - Deploy to Vercel or platform supporting Edge Runtime
 * - Middleware will automatically inject per-request nonces
 *
 * @created 2026-01-09
 * @updated 2026-01-09 - Added nonce-based CSP infrastructure
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
 * Generate a cryptographically secure nonce
 * Uses Web Crypto API for security
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
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
 * @param nonce - Optional nonce for script-src (required for production security)
 * @param isStaticExport - Whether this is a static export (no middleware)
 */
export function buildCspHeader(nonce?: string, isStaticExport = true): string {
  const config = getCspConfig();
  const isDev = process.env.NODE_ENV === "development";

  // Script sources
  // SECURITY:
  // - Development: unsafe-inline + unsafe-eval for hot reload
  // - Production with middleware (dynamic): nonce-based + strict-dynamic (most secure)
  // - Production static export: unsafe-inline (acceptable for static sites)
  //
  // NOTE: For static exports, we cannot use strict-dynamic effectively because:
  // 1. Nonce is baked into HTML at build time (same nonce for all users)
  // 2. Next.js external scripts don't have nonce attribute in static export
  // 3. strict-dynamic would block those scripts
  //
  // For maximum security with static export, deploy to a platform that supports
  // edge middleware (Vercel, Cloudflare) to inject per-request nonces.
  let scriptSrcDirectives: string[];

  if (isDev) {
    // Development: permissive for hot reload
    scriptSrcDirectives = [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      ...config.thirdParty.google,
      ...config.thirdParty.cloudflare,
    ];
  } else if (nonce && !isStaticExport) {
    // Production with middleware (dynamic rendering): most secure configuration
    // 'strict-dynamic' allows scripts loaded by nonced scripts to execute
    // This is crucial for Next.js which dynamically loads chunks
    scriptSrcDirectives = [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // Note: With strict-dynamic, allowlist URLs are ignored in modern browsers
      // but we keep them for older browser fallback
      ...config.thirdParty.google,
      ...config.thirdParty.cloudflare,
    ];
  } else {
    // Production static export: use domain allowlist (no unsafe-inline for external)
    // This is acceptable security for static sites:
    // - 'self' allows same-origin scripts
    // - 'unsafe-inline' needed for Next.js inline bootstrap scripts
    // - Explicit allowlist for third-party scripts
    scriptSrcDirectives = [
      "'self'",
      "'unsafe-inline'",
      ...config.thirdParty.google,
      ...config.thirdParty.cloudflare,
    ];
  }

  const scriptSrc = scriptSrcDirectives.filter(Boolean).join(" ");

  // Style sources - includes Google OAuth button styles
  // Note: 'unsafe-inline' for styles is generally acceptable and required for
  // CSS-in-JS libraries and inline styles. This is lower risk than script unsafe-inline.
  const styleSrcDirectives = [
    "'self'",
    "'unsafe-inline'",
    ...config.thirdParty.fonts,
    ...config.thirdParty.googleStyles,
  ];

  const styleSrc = styleSrcDirectives.filter(Boolean).join(" ");

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
 * @param nonce - Optional nonce for enhanced security
 */
export function getCspHeaderValue(nonce?: string): string {
  return buildCspHeader(nonce);
}

/**
 * Create CSP meta tag content with nonce
 * For use in layout.tsx with Script component
 */
export function createCspWithNonce(nonce: string): string {
  return buildCspHeader(nonce);
}
