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
 * 5. HMAC signing for data integrity verification
 *
 * @created 2026-01-06
 * @updated 2026-01-06 - Migrated to HttpOnly cookies for tokens
 * @updated 2026-01-08 - Added profile validation with Zod
 * @updated 2026-01-09 - Added HMAC signing for data integrity
 */

import { z } from "zod";
import { logger } from "@/lib/logger";
import { type UserData, UserDataSchema } from "./validation";

// ============================================================
// HMAC SIGNING FOR DATA INTEGRITY
// ============================================================

/**
 * Generate a simple hash for data integrity checking
 * Uses a combination of data + salt to create a signature
 * Note: This is for integrity, not encryption - data is still readable
 */
const STORAGE_SALT = "cdhc-2026-integrity-v1";

async function generateSignature(data: string): Promise<string> {
  // Use SubtleCrypto if available (modern browsers)
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(STORAGE_SALT);
    const messageData = encoder.encode(data);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", key, messageData);
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Fallback for older environments: simple hash
  let hash = 0;
  const str = data + STORAGE_SALT;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

async function verifySignature(
  data: string,
  signature: string
): Promise<boolean> {
  const expectedSignature = await generateSignature(data);
  return expectedSignature === signature;
}

/**
 * Wrap data with signature for storage
 */
interface SignedData<T> {
  data: T;
  sig: string;
  v: number; // Version for future migrations
}

async function signData<T>(data: T): Promise<string> {
  const dataStr = JSON.stringify(data);
  const signature = await generateSignature(dataStr);
  const signed: SignedData<T> = {
    data,
    sig: signature,
    v: 1,
  };
  return JSON.stringify(signed);
}

async function verifyAndExtract<T>(signedStr: string): Promise<T | null> {
  try {
    const signed = JSON.parse(signedStr) as SignedData<T>;

    // Check if it's signed data format
    if (!signed.sig || signed.v === undefined) {
      // Legacy unsigned data - migrate it
      logger.warn(
        "[SecureStorage] Found unsigned data, will re-sign on next save"
      );
      return signed as unknown as T;
    }

    // Verify signature
    const dataStr = JSON.stringify(signed.data);
    const isValid = await verifySignature(dataStr, signed.sig);

    if (!isValid) {
      logger.warn(
        "[SecureStorage] Data integrity check failed - data may have been tampered"
      );
      return null;
    }

    return signed.data;
  } catch {
    return null;
  }
}

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
   * Save user data with validation and HMAC signing
   */
  async setUser(user: UserData): Promise<boolean> {
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
      // Sign data with HMAC for integrity verification
      const signedData = await signData(result.data);
      localStorage.setItem(STORAGE_KEYS.USER, signedData);
      return true;
    } catch (e) {
      logger.error("[SecureStorage] Failed to save user:", e);
      return false;
    }
  },

  /**
   * Synchronous version for backward compatibility
   * Note: Uses fire-and-forget pattern
   */
  setUserSync(user: UserData): boolean {
    // Validate first (sync)
    const result = UserDataSchema.safeParse(user);
    if (!result.success) {
      logger.warn(
        "[SecureStorage] Invalid user data format:",
        result.error.issues
      );
      return false;
    }
    // Fire async signing but don't wait
    this.setUser(user).catch((e) => {
      logger.error("[SecureStorage] Async setUser failed:", e);
    });
    // Optimistically save unsigned for immediate use
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.data));
      return true;
    } catch (e) {
      logger.error("[SecureStorage] Failed to save user:", e);
      return false;
    }
  },

  /**
   * Get user data with validation and integrity check
   */
  async getUser(): Promise<UserData | null> {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;

      // Try to verify and extract signed data
      let parsed = await verifyAndExtract<UserData>(userStr);

      // If verification failed or legacy format, try direct parse
      if (!parsed) {
        try {
          parsed = JSON.parse(userStr);
        } catch {
          this.clearAuth();
          return null;
        }
      }

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
   * Synchronous getter for backward compatibility
   * Note: Cannot verify HMAC synchronously, so less secure
   */
  getUserSync(): UserData | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;

      // Try to parse - handle both signed and unsigned formats
      let parsed: unknown;
      try {
        const maybeSignedData = JSON.parse(userStr);
        // Check if it's signed format
        if (maybeSignedData.sig && maybeSignedData.v !== undefined) {
          parsed = maybeSignedData.data;
        } else {
          parsed = maybeSignedData;
        }
      } catch {
        this.clearAuth();
        return null;
      }

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
   * Save profile data with validation and HMAC signing
   */
  async setProfile(profile: unknown): Promise<boolean> {
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
      // Sign data with HMAC for integrity verification
      const signedData = await signData(result.data);
      localStorage.setItem(STORAGE_KEYS.PROFILE, signedData);
      return true;
    } catch (e) {
      logger.error("[SecureStorage] Failed to save profile:", e);
      return false;
    }
  },

  /**
   * Synchronous version for backward compatibility
   */
  setProfileSync(profile: unknown): boolean {
    const result = ProfileDataSchema.safeParse(profile);
    if (!result.success) {
      logger.warn(
        "[SecureStorage] Invalid profile data format:",
        result.error.issues
      );
      return false;
    }
    // Fire async signing
    this.setProfile(profile).catch((e) => {
      logger.error("[SecureStorage] Async setProfile failed:", e);
    });
    // Save immediately
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(result.data));
      return true;
    } catch (e) {
      logger.error("[SecureStorage] Failed to save profile:", e);
      return false;
    }
  },

  /**
   * Get profile data with validation and integrity check
   */
  async getProfile<T>(): Promise<T | null> {
    try {
      const profileStr = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!profileStr) return null;

      // Try to verify and extract signed data
      let parsed = await verifyAndExtract<T>(profileStr);

      // If verification failed or legacy format, try direct parse
      if (!parsed) {
        try {
          parsed = JSON.parse(profileStr);
        } catch {
          return null;
        }
      }

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
   * Synchronous getter for backward compatibility
   */
  getProfileSync<T>(): T | null {
    try {
      const profileStr = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!profileStr) return null;

      let parsed: unknown;
      try {
        const maybeSignedData = JSON.parse(profileStr);
        if (maybeSignedData.sig && maybeSignedData.v !== undefined) {
          parsed = maybeSignedData.data;
        } else {
          parsed = maybeSignedData;
        }
      } catch {
        return null;
      }

      const result = ProfileDataSchema.safeParse(parsed);
      if (!result.success) {
        logger.warn(
          "[SecureStorage] Stored profile data invalid:",
          result.error.issues
        );
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
    return this.getUserSync() !== null;
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Check if user data exists in localStorage (sync version)
 */
export function hasStoredUserData(): boolean {
  return SecureStorage.getUserSync() !== null;
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
