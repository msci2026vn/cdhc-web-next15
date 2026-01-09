// modules/shared/lib/api.ts

import { API_URL } from "@/lib/config";
import type {
  CaptchaChallenge,
  LegacyLookupRequest,
  LegacyLookupResponse,
} from "../types";

// Default timeout for API calls (30 seconds)
const DEFAULT_TIMEOUT = 30000;

/**
 * Create an AbortController with timeout
 */
function createTimeoutController(timeoutMs = DEFAULT_TIMEOUT): {
  controller: AbortController;
  timeoutId: ReturnType<typeof setTimeout>;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

/**
 * Get math CAPTCHA challenge
 */
export async function getCaptchaChallenge(
  signal?: AbortSignal
): Promise<CaptchaChallenge> {
  const { controller, timeoutId } = createTimeoutController();

  try {
    const response = await fetch(`${API_URL}/api/legacy/captcha/math`, {
      credentials: "include",
      signal: signal || controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to load CAPTCHA");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "CAPTCHA generation failed");
    }

    return {
      token: data.token,
      question: data.question,
      hint: data.hint,
      options: data.options,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Lookup legacy account
 */
export async function lookupLegacyAccount(
  request: LegacyLookupRequest,
  signal?: AbortSignal
): Promise<LegacyLookupResponse> {
  const { controller, timeoutId } = createTimeoutController();

  try {
    const response = await fetch(`${API_URL}/api/legacy/lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      credentials: "include",
      signal: signal || controller.signal,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: {
          code: "TIMEOUT",
          message: "Yêu cầu quá thời gian. Vui lòng thử lại.",
        },
      };
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
