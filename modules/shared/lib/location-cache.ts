/**
 * Location Data Cache
 *
 * Caches province and ward data to avoid re-fetching on every component mount.
 * Data is loaded once and shared across all LocationSelect instances.
 *
 * @created 2026-01-06
 */

import { logger } from "@/lib/logger";

// ============================================================
// TYPES
// ============================================================

export interface Province {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
}

export interface Ward {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  parent_code: string;
}

// ============================================================
// CACHE STATE
// ============================================================

let provincesCache: Province[] | null = null;
let wardsCache: Ward[] | null = null;
let provincesPromise: Promise<Province[]> | null = null;
let wardsPromise: Promise<Ward[]> | null = null;

// ============================================================
// CACHE FUNCTIONS
// ============================================================

/**
 * Load provinces (cached)
 * Returns cached data if available, otherwise fetches and caches
 */
export async function loadProvinces(): Promise<Province[]> {
  // Return cached data immediately
  if (provincesCache) {
    return provincesCache;
  }

  // Return existing promise if fetch is in progress
  if (provincesPromise) {
    return provincesPromise;
  }

  // Start new fetch
  provincesPromise = fetch("/tinh.json")
    .then((res) => res.json())
    .then((data: Record<string, Province>) => {
      const provinceList = Object.values(data);
      provinceList.sort((a, b) => a.name.localeCompare(b.name, "vi"));
      provincesCache = provinceList;
      return provinceList;
    })
    .catch((err) => {
      logger.error("Failed to load provinces:", err);
      provincesPromise = null; // Allow retry on error
      return [];
    });

  return provincesPromise;
}

/**
 * Load wards (cached)
 * Returns cached data if available, otherwise fetches and caches
 */
export async function loadWards(): Promise<Ward[]> {
  // Return cached data immediately
  if (wardsCache) {
    return wardsCache;
  }

  // Return existing promise if fetch is in progress
  if (wardsPromise) {
    return wardsPromise;
  }

  // Start new fetch
  wardsPromise = fetch("/xa.json")
    .then((res) => res.json())
    .then((data: Record<string, Ward>) => {
      const wardList = Object.values(data);
      wardsCache = wardList;
      return wardList;
    })
    .catch((err) => {
      logger.error("Failed to load wards:", err);
      wardsPromise = null; // Allow retry on error
      return [];
    });

  return wardsPromise;
}

/**
 * Get cached provinces (sync)
 * Returns null if not yet loaded
 */
export function getCachedProvinces(): Province[] | null {
  return provincesCache;
}

/**
 * Get cached wards (sync)
 * Returns null if not yet loaded
 */
export function getCachedWards(): Ward[] | null {
  return wardsCache;
}

/**
 * Check if location data is loaded
 */
export function isLocationDataLoaded(): boolean {
  return provincesCache !== null && wardsCache !== null;
}

/**
 * Preload all location data for LocationSelect component
 * Call this early in app lifecycle to warm the cache
 */
export async function preloadLocationSelectData(): Promise<void> {
  await Promise.all([loadProvinces(), loadWards()]);
}

/**
 * Clear LocationSelect cache (for testing or memory management)
 */
export function clearLocationSelectCache(): void {
  provincesCache = null;
  wardsCache = null;
  provincesPromise = null;
  wardsPromise = null;
}
