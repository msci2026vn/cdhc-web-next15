/**
 * Secure Storage Wrapper
 *
 * Provides safer localStorage operations for sensitive data.
 * NOTE: This is a client-side mitigation. For production security,
 * tokens should be stored in HttpOnly cookies on the backend.
 *
 * Security measures implemented:
 * 1. Token format validation (JWT structure)
 * 2. User data validation with Zod schema
 * 3. Automatic cleanup of invalid data
 * 4. Logging for security monitoring
 *
 * @created 2026-01-06
 */

import { type UserData, UserDataSchema } from "./validation";

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  PROFILE: "profile",
} as const;

// JWT regex: three base64 segments separated by dots
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

// ============================================================
// TOKEN VALIDATION
// ============================================================

/**
 * Validate JWT token format (not signature - that's server's job)
 */
function isValidJwtFormat(token: string): boolean {
  if (!token || typeof token !== "string") return false;

  // Basic format check
  if (!JWT_PATTERN.test(token)) return false;

  // Try to decode header and payload
  try {
    const [header, payload] = token.split(".");
    // atob throws if not valid base64
    JSON.parse(atob(header.replace(/-/g, "+").replace(/_/g, "/")));
    JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if token is expired (client-side check)
 */
function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (decoded.exp) {
      // Add 30 second buffer
      return decoded.exp * 1000 < Date.now() - 30000;
    }
    return false; // No exp claim, assume valid
  } catch {
    return true; // Can't decode = invalid
  }
}

// ============================================================
// SECURE STORAGE CLASS
// ============================================================

export const SecureStorage = {
  /**
   * Save access token with validation
   */
  setAccessToken(token: string): boolean {
    if (!isValidJwtFormat(token)) {
      console.warn("[SecureStorage] Invalid access token format");
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      return true;
    } catch (e) {
      console.error("[SecureStorage] Failed to save access token:", e);
      return false;
    }
  },

  /**
   * Get access token with validation
   * Returns null if token is invalid or expired
   */
  getAccessToken(): string | null {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) return null;

      // Validate format
      if (!isValidJwtFormat(token)) {
        console.warn("[SecureStorage] Stored access token has invalid format");
        this.clearAuth(); // Clear potentially tampered data
        return null;
      }

      // Check expiration
      if (isTokenExpired(token)) {
        console.info("[SecureStorage] Access token expired");
        // Don't clear - let refresh token flow handle it
        return null;
      }

      return token;
    } catch (e) {
      console.error("[SecureStorage] Failed to get access token:", e);
      return null;
    }
  },

  /**
   * Save refresh token with validation
   */
  setRefreshToken(token: string): boolean {
    if (!isValidJwtFormat(token)) {
      console.warn("[SecureStorage] Invalid refresh token format");
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
      return true;
    } catch (e) {
      console.error("[SecureStorage] Failed to save refresh token:", e);
      return false;
    }
  },

  /**
   * Get refresh token with validation
   */
  getRefreshToken(): string | null {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!token) return null;

      if (!isValidJwtFormat(token)) {
        console.warn("[SecureStorage] Stored refresh token has invalid format");
        this.clearAuth();
        return null;
      }

      return token;
    } catch (e) {
      console.error("[SecureStorage] Failed to get refresh token:", e);
      return null;
    }
  },

  /**
   * Save user data with validation
   */
  setUser(user: UserData): boolean {
    // Validate against schema before saving
    const result = UserDataSchema.safeParse(user);
    if (!result.success) {
      console.warn(
        "[SecureStorage] Invalid user data format:",
        result.error.issues
      );
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data));
      return true;
    } catch (e) {
      console.error("[SecureStorage] Failed to save user:", e);
      return false;
    }
  },

  /**
   * Get user data with validation
   */
  getUser(): UserData | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;

      const parsed = JSON.parse(userStr);
      const result = UserDataSchema.safeParse(parsed);

      if (!result.success) {
        console.warn(
          "[SecureStorage] Stored user data invalid:",
          result.error.issues
        );
        this.clearAuth();
        return null;
      }

      return result.data;
    } catch (e) {
      console.error("[SecureStorage] Failed to parse user:", e);
      this.clearAuth();
      return null;
    }
  },

  /**
   * Save profile data (less critical - just JSON stringify)
   */
  setProfile(profile: unknown): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return true;
    } catch (e) {
      console.error("[SecureStorage] Failed to save profile:", e);
      return false;
    }
  },

  /**
   * Get profile data
   */
  getProfile<T>(): T | null {
    try {
      const profileStr = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!profileStr) return null;
      return JSON.parse(profileStr) as T;
    } catch (e) {
      console.error("[SecureStorage] Failed to parse profile:", e);
      return null;
    }
  },

  /**
   * Clear all auth data
   */
  clearAuth(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch (e) {
      console.error("[SecureStorage] Failed to clear auth:", e);
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  },

  /**
   * Get auth header for API calls
   */
  getAuthHeader(): Record<string, string> {
    const token = this.getAccessToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  },
};

// ============================================================
// MIGRATION HELPER
// ============================================================

/**
 * Validate existing localStorage data
 * Call this on app init to clean up any invalid data
 */
export function validateStoredAuth(): {
  isValid: boolean;
  hasToken: boolean;
  hasUser: boolean;
} {
  const token = SecureStorage.getAccessToken();
  const user = SecureStorage.getUser();

  return {
    isValid: token !== null && user !== null,
    hasToken: token !== null,
    hasUser: user !== null,
  };
}
