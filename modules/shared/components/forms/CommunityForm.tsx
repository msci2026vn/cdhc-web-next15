"use client";

import { useState } from "react";
import { INTEREST_OPTIONS } from "../../data/form-options";
import { LocationSelect, MultiSelect, TextField } from "../ui";

export interface CommunityFormData {
  phone: string;
  interests: string[];
  provinceCode: string;
  wardCode: string;
}

interface CommunityFormProps {
  readonly onSubmit: (data: CommunityFormData) => void;
  readonly isLoading?: boolean;
}

export function CommunityForm({
  onSubmit,
  isLoading = false,
}: Readonly<CommunityFormProps>) {
  const [formData, setFormData] = useState<CommunityFormData>({
    phone: "",
    interests: [],
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CommunityFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (formData.interests.length === 0)
      newErrors.interests = "Vui lòng chọn ít nhất 1 sở thích";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-1">
      <TextField
        label="Số điện thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(v) => {
          setFormData({ ...formData, phone: v });
        }}
        placeholder="0912 345 678"
        required
        error={errors.phone}
      />

      <MultiSelect
        label="Quan tâm đến"
        name="interests"
        value={formData.interests}
        onChange={(v) => {
          setFormData({ ...formData, interests: v });
        }}
        options={INTEREST_OPTIONS}
        required
        maxSelect={4}
        error={errors.interests}
      />

      <LocationSelect
        provinceCode={formData.provinceCode}
        wardCode={formData.wardCode}
        onProvinceChange={(v) => {
          setFormData({ ...formData, provinceCode: v, wardCode: "" });
        }}
        onWardChange={(v) => {
          setFormData({ ...formData, wardCode: v });
        }}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-3 rounded-full font-semibold text-white transition-all mt-4 ${
          isLoading
            ? "bg-slate-300 cursor-not-allowed"
            : "gradient-primary hover:shadow-lg"
        }`}
      >
        {isLoading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
      </button>
    </div>
  );
}
