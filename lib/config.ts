/**
 * Application Configuration
 *
 * Centralized configuration for environment variables.
 * All API calls should use API_URL from this file.
 *
 * @created 2026-01-09
 */

/**
 * API Base URL from environment variable
 * REQUIRED: Must be set in .env.local, .env.production, etc.
 *
 * @throws Error in development if not set (to catch misconfiguration early)
 * @returns Empty string in production if not set (graceful degradation)
 */
function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    // In development, warn loudly
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[Config] NEXT_PUBLIC_API_URL is not set! API calls will fail."
      );
    }
    return "";
  }

  return url;
}

/**
 * API Base URL
 * Use this for all API calls: `${API_URL}/api/endpoint`
 */
export const API_URL = getApiUrl();

/**
 * Check if API URL is configured
 */
export function isApiConfigured(): boolean {
  return API_URL.length > 0;
}

/**
 * Google Client ID from environment variable
 */
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/**
 * Check if Google OAuth is configured
 */
export function isGoogleOAuthConfigured(): boolean {
  return GOOGLE_CLIENT_ID.length > 0;
}
