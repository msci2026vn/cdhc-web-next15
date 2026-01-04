"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [allWards, setAllWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);

  // Load provinces
  useEffect(() => {
    fetch("/tinh.json")
      .then((res) => res.json())
      .then((data: Record<string, Province>) => {
        const provinceList = Object.values(data);
        provinceList.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        setProvinces(provinceList);
      })
      .catch(console.error);
  }, []);

  // Load wards
  useEffect(() => {
    fetch("/xa.json")
      .then((res) => res.json())
      .then((data: Record<string, Ward>) => {
        const wardList = Object.values(data);
        setAllWards(wardList);
        setLoading(false);
      })
      .catch(console.error);
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
    console.log("Province selected:", code);
    onProvinceChange(code);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const code = e.target.value;
    console.log("Ward selected:", code);
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
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Địa điểm
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Province Select */}
        <div className="relative">
          <select
            value={provinceCode}
            onChange={handleProvinceChange}
            onMouseDown={(e) => e.stopPropagation()}
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
          <select
            value={wardCode}
            onChange={handleWardChange}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={!provinceCode}
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
    </div>
  );
}
