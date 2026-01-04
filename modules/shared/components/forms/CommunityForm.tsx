"use client";

import { useState } from "react";
import { COMMUNITY_INTERESTS } from "../../data/form-options";
import { LocationSelect, MultiSelectWithOther, TextField } from "../ui";

export interface CommunityFormData {
  fullName: string;
  phone: string;
  birthDate: string;
  provinceCode: string;
  wardCode: string;
  interests: string[];
  interestsOther: string;
}

interface CommunityFormProps {
  readonly onSubmit: (data: CommunityFormData) => void;
  readonly isLoading?: boolean;
}

export function CommunityForm({
  onSubmit,
  isLoading = false,
}: CommunityFormProps) {
  const [formData, setFormData] = useState<CommunityFormData>({
    fullName: "",
    phone: "",
    birthDate: "",
    provinceCode: "",
    wardCode: "",
    interests: [],
    interestsOther: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CommunityFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
    if (formData.interests.length === 0)
      newErrors.interests = "Vui lòng chọn ít nhất 1 sản phẩm quan tâm";

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
        label="Họ và tên"
        name="fullName"
        value={formData.fullName}
        onChange={(v) => {
          setFormData({ ...formData, fullName: v });
        }}
        placeholder="Nguyễn Văn A"
        required
        error={errors.fullName}
      />

      <TextField
        label="Số điện thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(v) => {
          setFormData({ ...formData, phone: v });
        }}
        placeholder="0912 345 678 (tùy chọn)"
      />

      <TextField
        label="Ngày sinh"
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={(v) => {
          setFormData({ ...formData, birthDate: v });
        }}
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
        required
        error={errors.provinceCode}
      />

      <MultiSelectWithOther
        label="Sản phẩm quan tâm"
        name="interests"
        value={formData.interests}
        otherValue={formData.interestsOther}
        onChange={(v) => {
          setFormData({ ...formData, interests: v });
        }}
        onOtherChange={(v) => {
          setFormData({ ...formData, interestsOther: v });
        }}
        options={COMMUNITY_INTERESTS}
        required
        error={errors.interests}
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
