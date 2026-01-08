const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://pro.cdhc.vn";

/**
 * Check if user/IP is rate limited
 */
export async function checkRateLimit(email?: string): Promise<{
  blocked: boolean;
  remainingTime?: number;
  attempts?: number;
  attemptsRemaining?: number;
}> {
  try {
    const response = await fetch(`${API_URL}/api/auth/check-rate-limit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });

    if (!response.ok) {
      return { blocked: false, attemptsRemaining: 5 };
    }

    const data = await response.json();
    return {
      blocked: data.data?.blocked ?? false,
      remainingTime: data.data?.remainingTime,
      attempts: data.data?.attempts,
      attemptsRemaining: data.data?.attemptsRemaining ?? 5,
    };
  } catch (_error) {
    // On error, assume not blocked
    return { blocked: false, attemptsRemaining: 5 };
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
