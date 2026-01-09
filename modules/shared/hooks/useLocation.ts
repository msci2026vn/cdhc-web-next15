"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { logger } from "@/lib/logger";

interface Province {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
}

interface Ward {
  code: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  parent_code: string;
}

interface LocationData {
  province_code: string;
  province_name: string;
  ward_code: string;
  ward_name: string;
}

export function useLocation(initialProvince = "", initialWard = "") {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] =
    useState(initialProvince);
  const [selectedWardCode, setSelectedWardCode] = useState(initialWard);
  const [loading, setLoading] = useState(true);

  // Single abort controller ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load both provinces and wards in parallel with Promise.all
  useEffect(() => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    async function loadLocationData() {
      try {
        // Fetch both files in parallel for better performance
        const [provincesRes, wardsRes] = await Promise.all([
          fetch("/tinh.json", { signal }),
          fetch("/xa.json", { signal }),
        ]);

        // Check if aborted during fetch
        if (signal.aborted) return;

        const [provincesData, wardsData] = await Promise.all([
          provincesRes.json() as Promise<Record<string, Province>>,
          wardsRes.json() as Promise<Record<string, Ward>>,
        ]);

        // Check if aborted during JSON parsing
        if (signal.aborted) return;

        // Process provinces
        const provinceList = Object.values(provincesData);
        provinceList.sort((a, b) => a.name.localeCompare(b.name, "vi"));

        // Process wards
        const wardList = Object.values(wardsData);

        // Update state
        setProvinces(provinceList);
        setAllWards(wardList);
        setLoading(false);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        logger.error("[useLocation] Failed to load location data:", err);
        setLoading(false);
      }
    }

    loadLocationData();

    return () => {
      controller.abort();
    };
  }, []);

  // Loc xa theo tinh da chon (dung parent_code)
  const filteredWards = useMemo(() => {
    if (!selectedProvinceCode) return [];
    return allWards
      .filter((w) => w.parent_code === selectedProvinceCode)
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [selectedProvinceCode, allWards]);

  // Get selected objects
  const selectedProvince = useMemo(
    () => provinces.find((p) => p.code === selectedProvinceCode),
    [provinces, selectedProvinceCode]
  );

  const selectedWard = useMemo(
    () => filteredWards.find((w) => w.code === selectedWardCode),
    [filteredWards, selectedWardCode]
  );

  // Set province va reset ward - memoized
  const setProvince = useCallback((code: string) => {
    setSelectedProvinceCode(code);
    setSelectedWardCode("");
  }, []);

  // Location data de luu vao profile
  const locationData: LocationData = useMemo(
    () => ({
      province_code: selectedProvinceCode,
      province_name: selectedProvince?.name ?? "",
      ward_code: selectedWardCode,
      ward_name: selectedWard?.name ?? "",
    }),
    [selectedProvinceCode, selectedProvince, selectedWardCode, selectedWard]
  );

  return {
    // Data
    provinces,
    wards: filteredWards,
    // Selected values
    selectedProvinceCode,
    selectedWardCode,
    selectedProvince,
    selectedWard,
    // Setters
    setProvince,
    setWard: setSelectedWardCode,
    // State
    loading,
    // Output
    locationData,
  };
}
