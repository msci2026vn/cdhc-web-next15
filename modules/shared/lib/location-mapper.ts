/**
 * Location Mapper Utility
 * Maps province/ward codes to human-readable names
 */

interface ProvinceData {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
}

interface WardData {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  parent_code: string;
}

// Cache for loaded data
let provincesCache: Record<string, ProvinceData> | null = null;
let wardsCache: Record<string, WardData> | null = null;

/**
 * Load province data from JSON file
 */
async function loadProvinces(): Promise<Record<string, ProvinceData>> {
  if (provincesCache) return provincesCache;

  const response = await fetch("/tinh.json");
  const data: Record<string, ProvinceData> = await response.json();
  provincesCache = data;
  return data;
}

/**
 * Load ward data from JSON file
 */
async function loadWards(): Promise<Record<string, WardData>> {
  if (wardsCache) return wardsCache;

  const response = await fetch("/xa.json");
  const data: Record<string, WardData> = await response.json();
  wardsCache = data;
  return data;
}

/**
 * Get province name by code
 * @param code Province code (e.g., "16" for Huế)
 * @returns Province name or code if not found
 */
export async function getProvinceName(code: string): Promise<string> {
  if (!code) return "";

  const provinces = await loadProvinces();
  return provinces[code]?.name || code;
}

/**
 * Get province full name with type by code
 * @param code Province code
 * @returns Full name like "Thành phố Huế" or code if not found
 */
export async function getProvinceFullName(code: string): Promise<string> {
  if (!code) return "";

  const provinces = await loadProvinces();
  return provinces[code]?.name_with_type || code;
}

/**
 * Get ward name by code
 * @param code Ward code (e.g., "3088")
 * @returns Ward name or code if not found
 */
export async function getWardName(code: string): Promise<string> {
  if (!code) return "";

  const wards = await loadWards();
  return wards[code]?.name || code;
}

/**
 * Get ward full name with type by code
 * @param code Ward code
 * @returns Full name like "Xã Minh Châu" or code if not found
 */
export async function getWardFullName(code: string): Promise<string> {
  if (!code) return "";

  const wards = await loadWards();
  return wards[code]?.name_with_type || code;
}

/**
 * Get ward path with province
 * @param code Ward code
 * @returns Full path like "Minh Châu, Hà Nội" or code if not found
 */
export async function getWardPath(code: string): Promise<string> {
  if (!code) return "";

  const wards = await loadWards();
  return wards[code]?.path || code;
}

/**
 * Get full location string from province and ward codes
 * @param provinceCode Province code
 * @param wardCode Ward code
 * @returns Location string like "Xã Minh Châu, Thành phố Hà Nội"
 */
export async function getFullLocation(
  provinceCode: string,
  wardCode: string
): Promise<string> {
  const parts: string[] = [];

  if (wardCode) {
    const wardName = await getWardFullName(wardCode);
    if (wardName) parts.push(wardName);
  }

  if (provinceCode) {
    const provinceName = await getProvinceFullName(provinceCode);
    if (provinceName) parts.push(provinceName);
  }

  return parts.join(", ");
}

/**
 * Get short location string from province and ward codes
 * @param provinceCode Province code
 * @param wardCode Ward code
 * @returns Location string like "Minh Châu, Hà Nội"
 */
export async function getShortLocation(
  provinceCode: string,
  wardCode: string
): Promise<string> {
  const parts: string[] = [];

  if (wardCode) {
    const wardName = await getWardName(wardCode);
    if (wardName) parts.push(wardName);
  }

  if (provinceCode) {
    const provinceName = await getProvinceName(provinceCode);
    if (provinceName) parts.push(provinceName);
  }

  return parts.join(", ");
}

/**
 * Batch lookup for multiple locations (more efficient)
 * @param locations Array of { provinceCode, wardCode }
 * @returns Array of location strings
 */
export async function batchGetLocations(
  locations: Array<{ provinceCode: string; wardCode: string }>
): Promise<string[]> {
  // Preload both data sets
  await Promise.all([loadProvinces(), loadWards()]);

  // Now lookups are from cache
  return Promise.all(
    locations.map(({ provinceCode, wardCode }) =>
      getShortLocation(provinceCode, wardCode)
    )
  );
}

/**
 * Preload location data for faster lookups
 * Call this on app init if you need fast location lookups
 */
export async function preloadLocationData(): Promise<void> {
  await Promise.all([loadProvinces(), loadWards()]);
}

/**
 * Clear the cache (useful for testing or memory management)
 */
export function clearLocationCache(): void {
  provincesCache = null;
  wardsCache = null;
}
