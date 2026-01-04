"use client";

import { useState } from "react";
import {
  PLATFORM_OPTIONS,
  REVIEW_CATEGORIES,
  REVIEW_EXPERIENCE_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface KocFormData {
  phone: string;
  platforms: string[];
  experience: string;
  categories: string[];
  profileUrl: string;
  provinceCode: string;
  wardCode: string;
}

interface KocFormProps {
  onSubmit: (data: KocFormData) => void;
  isLoading?: boolean;
}

export function KocForm({ onSubmit, isLoading = false }: KocFormProps) {
  const [formData, setFormData] = useState<KocFormData>({
    phone: "",
    platforms: [],
    experience: "",
    categories: [],
    profileUrl: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof KocFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KocFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (formData.platforms.length === 0)
      newErrors.platforms = "Vui lòng chọn ít nhất 1 nền tảng";
    if (!formData.experience)
      newErrors.experience = "Vui lòng chọn kinh nghiệm";
    if (formData.categories.length === 0)
      newErrors.categories = "Vui lòng chọn ít nhất 1 danh mục";

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
        onChange={(v) => setFormData({ ...formData, phone: v })}
        placeholder="0912 345 678"
        required
        error={errors.phone}
      />

      <MultiSelect
        label="Nền tảng hoạt động"
        name="platforms"
        value={formData.platforms}
        onChange={(v) => setFormData({ ...formData, platforms: v })}
        options={PLATFORM_OPTIONS}
        required
        error={errors.platforms}
      />

      <SelectField
        label="Kinh nghiệm review"
        name="experience"
        value={formData.experience}
        onChange={(v) => setFormData({ ...formData, experience: v })}
        options={REVIEW_EXPERIENCE_OPTIONS}
        required
        error={errors.experience}
      />

      <MultiSelect
        label="Danh mục quan tâm"
        name="categories"
        value={formData.categories}
        onChange={(v) => setFormData({ ...formData, categories: v })}
        options={REVIEW_CATEGORIES}
        required
        maxSelect={3}
        error={errors.categories}
      />

      <TextField
        label="Link profile"
        name="profileUrl"
        type="url"
        value={formData.profileUrl}
        onChange={(v) => setFormData({ ...formData, profileUrl: v })}
        placeholder="https://facebook.com/yourprofile"
      />

      <LocationSelect
        provinceCode={formData.provinceCode}
        wardCode={formData.wardCode}
        onProvinceChange={(v) =>
          setFormData({ ...formData, provinceCode: v, wardCode: "" })
        }
        onWardChange={(v) => setFormData({ ...formData, wardCode: v })}
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
