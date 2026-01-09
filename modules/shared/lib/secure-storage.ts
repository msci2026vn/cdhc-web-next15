/**
 * Secure Storage Wrapper
 *
 * Provides localStorage operations for non-sensitive user data.
 * Tokens are now stored in HttpOnly cookies (handled by backend).
 *
 * Security measures:
 * 1. User data validation with Zod schema
 * 2. Profile data validation with Zod schema
 * 3. Automatic cleanup of invalid data
 * 4. Logging for security monitoring
 *
 * @created 2026-01-06
 * @updated 2026-01-06 - Migrated to HttpOnly cookies for tokens
 * @updated 2026-01-08 - Added profile validation with Zod
 */

import { z } from "zod";
import { logger } from "@/lib/logger";
import { type UserData, UserDataSchema } from "./validation";

// ============================================================
// PROFILE VALIDATION SCHEMA
// ============================================================

/**
 * Profile data schema for validation
 * Note: Profile can have many optional fields depending on role
 */
const ProfileDataSchema = z
  .object({
    fullName: z.string().max(200).optional(),
    phone: z.string().max(20).optional(),
    birthDate: z.string().max(20).nullable().optional(),
    province: z.string().max(100).optional(),
    ward: z.string().max(100).optional(),
    address: z.string().max(500).optional(),
    interests: z.array(z.string().max(50)).optional(),
    interestsOther: z.string().max(200).nullable().optional(),
    // Legacy fields
    legacyRank: z.string().max(50).nullable().optional(),
    legacyShares: z.union([z.string(), z.number()]).nullable().optional(),
    legacyOgn: z.union([z.string(), z.number()]).nullable().optional(),
    legacyTor: z.union([z.string(), z.number()]).nullable().optional(),
    legacyF1Total: z.number().nullable().optional(),
    legacyF1s: z
      .array(
        z.object({
          id: z.string().max(100),
          n: z.string().max(200),
          p: z.string().max(20),
        })
      )
      .nullable()
      .optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .passthrough(); // Allow additional fields for different roles

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
      logger.warn(
        "[SecureStorage] Invalid user data format:",
        result.error.issues
      );
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data));
      return true;
    } catch (e) {
      logger.error("[SecureStorage] Failed to save user:", e);
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
        logger.warn(
          "[SecureStorage] Stored user data invalid:",
          result.error.issues
        );
        this.clearAuth();
        return null;
      }

      return result.data;
    } catch (e) {
      logger.error("[SecureStorage] Failed to parse user:", e);
      this.clearAuth();
      return null;
    }
  },

  /**
   * Save profile data with validation
   */
  setProfile(profile: unknown): boolean {
    // Validate against schema before saving
    const result = ProfileDataSchema.safeParse(profile);
    if (!result.success) {
      logger.warn(
        "[SecureStorage] Invalid profile data format:",
        result.error.issues
      );
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(result.data));
      return true;
    } catch (e) {
      logger.error("[SecureStorage] Failed to save profile:", e);
      return false;
    }
  },

  /**
   * Get profile data with validation
   */
  getProfile<T>(): T | null {
    try {
      const profileStr = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!profileStr) return null;

      const parsed = JSON.parse(profileStr);
      const result = ProfileDataSchema.safeParse(parsed);

      if (!result.success) {
        logger.warn(
          "[SecureStorage] Stored profile data invalid:",
          result.error.issues
        );
        // Don't clear - profile might have extra fields from different roles
        return null;
      }

      return result.data as T;
    } catch (e) {
      logger.error("[SecureStorage] Failed to parse profile:", e);
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
      logger.error("[SecureStorage] Failed to clear auth:", e);
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
