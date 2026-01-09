/**
 * Validation schemas using Zod
 * For runtime type checking and data validation
 *
 * @created 2026-01-06
 */

import { z } from "zod";
import { logger } from "@/lib/logger";

// ============================================================
// USER & AUTH SCHEMAS
// ============================================================

/**
 * User data stored in localStorage after login
 */
// Custom URL validator that only allows http/https protocols
const safeUrlSchema = z.string().refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Invalid URL or unsupported protocol" }
);

export const UserDataSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum([
    "farmer",
    "community",
    "business",
    "coop",
    "shop",
    "expert",
    "kol",
    "koc",
  ]),
  status: z.enum(["pending", "approved", "rejected"]),
  picture: safeUrlSchema.optional(),
});

export type UserData = z.infer<typeof UserDataSchema>;

/**
 * Profile data from API
 */
export const ProfileDataSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  birthDate: z.string().nullable(),
  province: z.string(),
  ward: z.string(),
  interests: z.array(z.string()),
  interestsOther: z.string().nullable(),
  // Legacy fields
  legacyRank: z.string().nullable().optional(),
  legacyShares: z.union([z.string(), z.number()]).nullable().optional(),
  legacyOgn: z.union([z.string(), z.number()]).nullable().optional(),
  legacyTor: z.union([z.string(), z.number()]).nullable().optional(),
  legacyF1Total: z.number().nullable().optional(),
  legacyF1s: z
    .array(
      z.object({
        id: z.string(),
        n: z.string(),
        p: z.string(),
      })
    )
    .nullable()
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ProfileData = z.infer<typeof ProfileDataSchema>;

/**
 * API response wrapper
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z
      .object({
        code: z.string(),
        message: z.string(),
        details: z.unknown().optional(),
      })
      .optional(),
    data: dataSchema.optional(),
  });

/**
 * Profile API response
 */
export const ProfileApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  profile: ProfileDataSchema.optional(),
});

/**
 * Points conversion history item
 */
export const ConversionHistoryItemSchema = z.object({
  id: z.string(),
  fromType: z.enum(["ogn", "tor"]),
  fromAmount: z.number(),
  toAmount: z.number(),
  status: z.string().optional().default("success"),
  createdAt: z.string(),
});

export type ConversionHistoryItem = z.infer<typeof ConversionHistoryItemSchema>;

/**
 * Points history API response
 */
export const PointsHistoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  conversions: z.array(ConversionHistoryItemSchema).optional(),
  pagination: z
    .object({
      page: z.number(),
      totalPages: z.number(),
      total: z.number().optional(),
    })
    .optional(),
});

// ============================================================
// FORM DATA SCHEMAS (for profile validation)
// ============================================================

/**
 * Base profile fields shared across roles
 */
const BaseProfileFieldsSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  province: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  ward: z.string().min(1, "Vui lòng chọn xã/phường"),
});

/**
 * Check if profile data has required fields for farmer/community roles
 */
export function hasRequiredProfileFields(
  data: unknown
): data is { fullName: string; province: string; ward: string } {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.fullName === "string" &&
    obj.fullName.length > 0 &&
    typeof obj.province === "string" &&
    obj.province.length > 0 &&
    typeof obj.ward === "string" &&
    obj.ward.length > 0
  );
}

/**
 * Validate base profile fields
 */
export function validateBaseProfileFields(data: unknown): {
  success: boolean;
  error?: string;
} {
  const result = BaseProfileFieldsSchema.safeParse(data);
  if (result.success) {
    return { success: true };
  }
  const firstError = result.error.issues[0];
  return {
    success: false,
    error: firstError?.message || "Dữ liệu không hợp lệ",
  };
}

// ============================================================
// SAFE PARSE HELPERS
// ============================================================

/**
 * Safely parse user data from localStorage
 */
export function parseUserData(jsonString: string): UserData | null {
  try {
    const parsed = JSON.parse(jsonString);
    const result = UserDataSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    logger.warn("Invalid user data format:", result.error.issues);
    return null;
  } catch {
    logger.warn("Failed to parse user data JSON");
    return null;
  }
}

/**
 * Safely parse profile API response
 */
export function parseProfileResponse(data: unknown): {
  success: boolean;
  profile?: ProfileData;
  error?: string;
} {
  const result = ProfileApiResponseSchema.safeParse(data);
  if (result.success) {
    return {
      success: result.data.success,
      profile: result.data.profile,
    };
  }
  logger.warn("Invalid profile response format:", result.error.issues);
  return {
    success: false,
    error: "Invalid response format",
  };
}

/**
 * Safely parse points history response
 */
export function parsePointsHistoryResponse(data: unknown): {
  success: boolean;
  conversions: ConversionHistoryItem[];
  pagination?: { page: number; totalPages: number };
  error?: string;
} {
  const result = PointsHistoryResponseSchema.safeParse(data);
  if (result.success) {
    return {
      success: result.data.success,
      conversions: result.data.conversions || [],
      pagination: result.data.pagination,
    };
  }
  logger.warn("Invalid points history response:", result.error.issues);
  return {
    success: false,
    conversions: [],
    error: "Invalid response format",
  };
}

/**
 * Safely parse any JSON with a schema
 */
export function safeJsonParse<T>(
  jsonString: string,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const result = schema.safeParse(parsed);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      error: result.error.issues[0]?.message || "Invalid format",
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "JSON parse failed",
    };
  }
}
