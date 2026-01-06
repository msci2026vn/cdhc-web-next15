/**
 * Secure Storage Wrapper
 *
 * Provides localStorage operations for non-sensitive user data.
 * Tokens are now stored in HttpOnly cookies (handled by backend).
 *
 * Security measures:
 * 1. User data validation with Zod schema
 * 2. Automatic cleanup of invalid data
 * 3. Logging for security monitoring
 *
 * @created 2026-01-06
 * @updated 2026-01-06 - Migrated to HttpOnly cookies for tokens
 */

import { type UserData, UserDataSchema } from "./validation";

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEYS = {
  USER: "user",
  PROFILE: "profile",
} as const;

// ============================================================
// SECURE STORAGE CLASS
// ============================================================

export const SecureStorage = {
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
   * Clear all local auth data (user/profile)
   * Note: Tokens are cleared via backend logout endpoint
   */
  clearAuth(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch (e) {
      console.error("[SecureStorage] Failed to clear auth:", e);
    }
  },

  /**
   * Check if user data exists locally
   * Note: Actual auth state is determined by HttpOnly cookies (server-side)
   */
  hasUserData(): boolean {
    return this.getUser() !== null;
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Check if user data exists in localStorage
 */
export function hasStoredUserData(): boolean {
  return SecureStorage.getUser() !== null;
}

/**
 * Clear old token data from localStorage (migration cleanup)
 * Call this once to remove any legacy token data
 */
export function clearLegacyTokenData(): void {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch {
    // Ignore errors
  }
}
