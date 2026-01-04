"use client";

import { useState } from "react";
import {
  EXPERIENCE_YEARS_OPTIONS,
  EXPERTISE_AREAS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface ExpertFormData {
  phone: string;
  title: string;
  organization: string;
  expertise: string[];
  experience: string;
  bio: string;
  provinceCode: string;
  wardCode: string;
}

interface ExpertFormProps {
  onSubmit: (data: ExpertFormData) => void;
  isLoading?: boolean;
}

export function ExpertForm({ onSubmit, isLoading = false }: ExpertFormProps) {
  const [formData, setFormData] = useState<ExpertFormData>({
    phone: "",
    title: "",
    organization: "",
    expertise: [],
    experience: "",
    bio: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpertFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpertFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (formData.expertise.length === 0)
      newErrors.expertise = "Vui lòng chọn ít nhất 1 lĩnh vực";
    if (!formData.experience)
      newErrors.experience = "Vui lòng chọn kinh nghiệm";

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

      <TextField
        label="Chức danh"
        name="title"
        value={formData.title}
        onChange={(v) => setFormData({ ...formData, title: v })}
        placeholder="Tiến sĩ, Kỹ sư nông nghiệp..."
      />

      <TextField
        label="Tổ chức/Đơn vị"
        name="organization"
        value={formData.organization}
        onChange={(v) => setFormData({ ...formData, organization: v })}
        placeholder="Viện Nghiên cứu..."
      />

      <MultiSelect
        label="Lĩnh vực chuyên môn"
        name="expertise"
        value={formData.expertise}
        onChange={(v) => setFormData({ ...formData, expertise: v })}
        options={EXPERTISE_AREAS}
        required
        maxSelect={4}
        error={errors.expertise}
      />

      <SelectField
        label="Kinh nghiệm"
        name="experience"
        value={formData.experience}
        onChange={(v) => setFormData({ ...formData, experience: v })}
        options={EXPERIENCE_YEARS_OPTIONS}
        required
        error={errors.experience}
      />

      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Giới thiệu bản thân
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Mô tả ngắn về kinh nghiệm và chuyên môn..."
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

      <LocationSelect
        provinceCode={formData.provinceCode}
        wardCode={formData.wardCode}
        onProvinceChange={(v) => {
          console.log("ExpertForm onProvinceChange:", v);
          setFormData((prev) => ({ ...prev, provinceCode: v, wardCode: "" }));
        }}
        onWardChange={(v) => {
          console.log("ExpertForm onWardChange:", v);
          setFormData((prev) => ({ ...prev, wardCode: v }));
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
