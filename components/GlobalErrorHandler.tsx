"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

/**
 * Check if error object contains a pattern in its properties
 * PERFORMANCE: Directly check object properties instead of JSON.stringify
 */
function checkErrorObject(error: object, pattern: string): boolean {
  try {
    // Check common error properties
    const props = ["code", "name", "type", "reason"];
    for (const prop of props) {
      const value = (error as Record<string, unknown>)[prop];
      if (typeof value === "string" && value.includes(pattern)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Global Error Handler
 *
 * Suppresses third-party script errors (onboarding.js, gads-scrapper, etc.)
 * that are not related to our application code.
 *
 * These errors come from:
 * - Browser extensions
 * - Google Ads scripts
 * - Analytics scripts
 * - Other third-party injected scripts
 *
 * @created 2026-01-09
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      const stack = error?.stack || "";
      const message = error?.message || "";

      // List of third-party scripts/errors to suppress
      const thirdPartyPatterns = [
        "onboarding.js",
        "gads-scrapper",
        "googletagmanager",
        "google-analytics",
        "doubleclick",
        "gtag",
        "fbevents",
        "analytics",
        // Browser translation extensions
        "SOURCE_LANG_UI",
        "EMPTY_TEXT",
        "translate",
      ];

      // Check if error is from third-party script or extension
      // PERFORMANCE: Avoid JSON.stringify - check properties directly instead
      const isThirdParty =
        error === undefined ||
        thirdPartyPatterns.some(
          (pattern) =>
            stack.includes(pattern) ||
            message.includes(pattern) ||
            // Check error object properties directly (faster than JSON.stringify)
            (error &&
              typeof error === "object" &&
              checkErrorObject(error, pattern))
        );

      if (isThirdParty) {
        logger.warn("[GlobalErrorHandler] Suppressed third-party error:", {
          message: message || "undefined",
          stack: stack.slice(0, 200),
        });

        // Prevent error from showing in console
        event.preventDefault();
      }
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      const filename = event.filename || "";

      // Suppress errors from third-party scripts
      const thirdPartyDomains = [
        "googletagmanager.com",
        "google-analytics.com",
        "doubleclick.net",
        "googlesyndication.com",
        "facebook.net",
        "connect.facebook.net",
      ];

      const isThirdParty =
        thirdPartyDomains.some((domain) => filename.includes(domain)) ||
        filename.includes("onboarding.js") ||
        filename.includes("gads-scrapper");

      if (isThirdParty) {
        logger.warn("[GlobalErrorHandler] Suppressed third-party error:", {
          message: event.message,
          filename: filename,
        });

        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
