"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCachedProvinces,
  getCachedWards,
  loadProvinces,
  loadWards,
  type Province,
  type Ward,
} from "@/modules/shared/lib/location-cache";

interface LocationSelectProps {
  provinceCode: string;
  wardCode: string;
  onProvinceChange: (code: string) => void;
  onWardChange: (code: string) => void;
  required?: boolean;
  error?: string;
}

export function LocationSelect({
  provinceCode,
  wardCode,
  onProvinceChange,
  onWardChange,
  required = false,
  error,
}: LocationSelectProps) {
  const [provinces, setProvinces] = useState<Province[]>(
    () => getCachedProvinces() || []
  );
  const [allWards, setAllWards] = useState<Ward[]>(
    () => getCachedWards() || []
  );
  const [loading, setLoading] = useState(
    () => !getCachedProvinces() || !getCachedWards()
  );

  // Load data from cache or fetch if not cached
  useEffect(() => {
    // If already have cached data, no need to fetch
    const cachedProvinces = getCachedProvinces();
    const cachedWards = getCachedWards();

    if (cachedProvinces && cachedWards) {
      setProvinces(cachedProvinces);
      setAllWards(cachedWards);
      setLoading(false);
      return;
    }

    // Load data (will use cache if available)
    let mounted = true;

    Promise.all([loadProvinces(), loadWards()])
      .then(([provinceList, wardList]) => {
        if (mounted) {
          setProvinces(provinceList);
          setAllWards(wardList);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load location data:", err);
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Filter wards by selected province
  const filteredWards = useMemo(() => {
    if (!provinceCode) return [];
    return allWards
      .filter((w) => w.parent_code === provinceCode)
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  }, [provinceCode, allWards]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const code = e.target.value;
    onProvinceChange(code);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const code = e.target.value;
    onWardChange(code);
  };

  if (loading) {
    return (
      <div className="mb-4">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <fieldset className="mb-4">
      <legend className="block text-sm font-medium text-slate-700 mb-2">
        Địa điểm
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {/* Province Select */}
        <div className="relative">
          <label htmlFor="province-select" className="sr-only">
            Tỉnh/thành phố
          </label>
          <select
            id="province-select"
            value={provinceCode}
            onChange={handleProvinceChange}
            onMouseDown={(e) => e.stopPropagation()}
            aria-label="Chọn tỉnh/thành phố"
            className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-colors focus:outline-none focus:border-green-500 bg-white cursor-pointer ${
              error ? "border-red-300 bg-red-50" : "border-slate-200"
            }`}
          >
            <option value="">Chọn tỉnh/thành</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward Select */}
        <div className="relative">
          <label htmlFor="ward-select" className="sr-only">
            Xã/phường
          </label>
          <select
            id="ward-select"
            value={wardCode}
            onChange={handleWardChange}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!provinceCode}
            aria-label="Chọn xã/phường"
            className={`w-full px-4 py-3 pr-10 border-2 rounded-xl transition-colors focus:outline-none focus:border-green-500 bg-white cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              error ? "border-red-300 bg-red-50" : "border-slate-200"
            }`}
          >
            <option value="">Chọn xã/phường</option>
            {filteredWards.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name_with_type}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </fieldset>
  );
}
