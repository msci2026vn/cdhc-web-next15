"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

  // Abort controller refs for cleanup
  const provinceAbortRef = useRef<AbortController | null>(null);
  const wardAbortRef = useRef<AbortController | null>(null);

  // Load tinh tu /public/tinh.json
  useEffect(() => {
    const controller = new AbortController();
    provinceAbortRef.current = controller;

    fetch("/tinh.json", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: Record<string, Province>) => {
        const provinceList = Object.values(data);
        provinceList.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        setProvinces(provinceList);
      })
      .catch((err) => {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error(err);
      });

    return () => {
      controller.abort();
    };
  }, []);

  // Load xa tu /public/xa.json
  useEffect(() => {
    const controller = new AbortController();
    wardAbortRef.current = controller;

    fetch("/xa.json", { signal: controller.signal })
      .then((res) => res.json())
      .then((data: Record<string, Ward>) => {
        const wardList = Object.values(data);
        setAllWards(wardList);
        setLoading(false);
      })
      .catch((err) => {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error(err);
      });

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

  // Set province va reset ward
  const setProvince = (code: string) => {
    setSelectedProvinceCode(code);
    setSelectedWardCode("");
  };

  // Location data de luu vao profile
  const locationData: LocationData = {
    province_code: selectedProvinceCode,
    province_name: selectedProvince?.name ?? "",
    ward_code: selectedWardCode,
    ward_name: selectedWard?.name ?? "",
  };

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
