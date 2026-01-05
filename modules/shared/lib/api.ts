// modules/shared/lib/api.ts

import type {
  CaptchaChallenge,
  LegacyLookupRequest,
  LegacyLookupResponse,
} from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://pro.cdhc.vn";

/**
 * Get math CAPTCHA challenge
 */
export async function getCaptchaChallenge(): Promise<CaptchaChallenge> {
  const response = await fetch(`${API_URL}/api/legacy/captcha/math`);

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
}

/**
 * Lookup legacy account
 */
export async function lookupLegacyAccount(
  request: LegacyLookupRequest
): Promise<LegacyLookupResponse> {
  const response = await fetch(`${API_URL}/api/legacy/lookup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data;
}
