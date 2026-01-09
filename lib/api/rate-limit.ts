import { API_URL } from "@/lib/config";

/**
 * Check if user/IP is rate limited
 *
 * SECURITY: On network errors or API failures, we fail OPEN (allow attempts)
 * because the backend is the ultimate authority on rate limiting.
 * This is acceptable because:
 * 1. Backend enforces rate limits with HttpOnly cookies - cannot be bypassed
 * 2. Frontend rate limit is only for UX (show warnings before being blocked)
 * 3. If backend is unreachable, login will fail anyway
 *
 * If stricter frontend behavior is needed, change to fail CLOSED:
 * return { blocked: true, attemptsRemaining: 0 };
 */
export async function checkRateLimit(email?: string): Promise<{
  blocked: boolean;
  remainingTime?: number;
  attempts?: number;
  attemptsRemaining?: number;
  error?: boolean;
}> {
  try {
    const response = await fetch(`${API_URL}/api/auth/check-rate-limit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      // API returned error - fail open but indicate error occurred
      return { blocked: false, attemptsRemaining: 5, error: true };
    }

    const data = await response.json();
    return {
      blocked: data.data?.blocked ?? false,
      remainingTime: data.data?.remainingTime,
      attempts: data.data?.attempts,
      attemptsRemaining: data.data?.attemptsRemaining ?? 5,
    };
  } catch (_error) {
    // Network error - fail open but indicate error occurred
    // Backend will still enforce rate limits via HttpOnly cookies
    return { blocked: false, attemptsRemaining: 5, error: true };
  }
}

interface RateLimitResponseData {
  retryAfter?: number;
  message?: string;
  warning?: string;
  attemptsRemaining?: number;
}

/**
 * Handle rate limit response from login/register
 */
export function handleRateLimitResponse(response: {
  status: number;
  data?: RateLimitResponseData;
}): {
  isRateLimited: boolean;
  warning?: string;
  attemptsRemaining?: number;
  retryAfter?: number;
  message?: string;
} {
  // Check for 429 status
  if (response.status === 429) {
    return {
      isRateLimited: true,
      retryAfter: response.data?.retryAfter || 60,
      message: response.data?.message || "Tài khoản tạm thời bị khóa",
    };
  }

  // Check for warning in response
  if (response.data?.warning) {
    return {
      isRateLimited: false,
      warning: response.data.warning,
      attemptsRemaining: response.data.attemptsRemaining,
    };
  }

  return { isRateLimited: false };
}
