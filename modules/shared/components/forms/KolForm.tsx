"use client";

import { useState } from "react";
import {
  CONTENT_TYPES,
  FOLLOWER_COUNT_OPTIONS,
  PLATFORM_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface KolFormData {
  phone: string;
  stageName: string;
  platforms: string[];
  followerCount: string;
  contentTypes: string[];
  profileUrl: string;
  provinceCode: string;
  wardCode: string;
}

interface KolFormProps {
  readonly onSubmit: (data: KolFormData) => void;
  readonly isLoading?: boolean;
}

export function KolForm({
  onSubmit,
  isLoading = false,
}: Readonly<KolFormProps>) {
  const [formData, setFormData] = useState<KolFormData>({
    phone: "",
    stageName: "",
    platforms: [],
    followerCount: "",
    contentTypes: [],
    profileUrl: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof KolFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KolFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (formData.platforms.length === 0)
      newErrors.platforms = "Vui lòng chọn ít nhất 1 nền tảng";
    if (!formData.followerCount)
      newErrors.followerCount = "Vui lòng chọn số lượng follower";
    if (!formData.profileUrl)
      newErrors.profileUrl = "Vui lòng nhập link profile";

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

      <TextField
        label="Tên nghệ danh"
        name="stageName"
        value={formData.stageName}
        onChange={(v) => {
          setFormData({ ...formData, stageName: v });
        }}
        placeholder="Tên kênh/nickname"
      />

      <MultiSelect
        label="Nền tảng hoạt động"
        name="platforms"
        value={formData.platforms}
        onChange={(v) => {
          setFormData({ ...formData, platforms: v });
        }}
        options={PLATFORM_OPTIONS}
        required
        error={errors.platforms}
      />

      <SelectField
        label="Số lượng follower"
        name="followerCount"
        value={formData.followerCount}
        onChange={(v) => {
          setFormData({ ...formData, followerCount: v });
        }}
        options={FOLLOWER_COUNT_OPTIONS}
        required
        error={errors.followerCount}
      />

      <MultiSelect
        label="Loại nội dung"
        name="contentTypes"
        value={formData.contentTypes}
        onChange={(v) => {
          setFormData({ ...formData, contentTypes: v });
        }}
        options={CONTENT_TYPES}
        maxSelect={3}
      />

      <TextField
        label="Link profile chính"
        name="profileUrl"
        type="url"
        value={formData.profileUrl}
        onChange={(v) => {
          setFormData({ ...formData, profileUrl: v });
        }}
        placeholder="https://facebook.com/yourpage"
        required
        error={errors.profileUrl}
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
