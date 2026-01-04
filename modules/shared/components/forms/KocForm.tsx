"use client";

import { useState } from "react";
import {
  KOC_FOLLOWER_OPTIONS,
  KOC_PLATFORMS,
  KOC_PRICE_OPTIONS,
  KOC_REVIEW_CATEGORIES,
  KOC_REVIEW_COUNT_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface KocFormData {
  fullName: string;
  phone: string;
  provinceCode: string;
  wardCode: string;
  reviewCategories: string[];
  platforms: string[];
  totalFollowers: string;
  reviewCount: string;
  bio: string;
  mainPlatformUrl: string;
  priceRange: string;
}

interface KocFormProps {
  readonly onSubmit: (data: KocFormData) => void;
  readonly isLoading?: boolean;
}

export function KocForm({ onSubmit, isLoading = false }: KocFormProps) {
  const [formData, setFormData] = useState<KocFormData>({
    fullName: "",
    phone: "",
    provinceCode: "",
    wardCode: "",
    reviewCategories: [],
    platforms: [],
    totalFollowers: "",
    reviewCount: "",
    bio: "",
    mainPlatformUrl: "",
    priceRange: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof KocFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KocFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
    if (formData.reviewCategories.length === 0)
      newErrors.reviewCategories = "Vui lòng chọn ít nhất 1 danh mục";
    if (formData.platforms.length === 0)
      newErrors.platforms = "Vui lòng chọn ít nhất 1 nền tảng";
    if (!formData.totalFollowers)
      newErrors.totalFollowers = "Vui lòng chọn tổng số followers";
    if (!formData.reviewCount)
      newErrors.reviewCount = "Vui lòng chọn số bài review";
    if (!formData.mainPlatformUrl)
      newErrors.mainPlatformUrl = "Vui lòng nhập link kênh chính";
    if (!formData.priceRange) newErrors.priceRange = "Vui lòng chọn mức giá";

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
        placeholder="0912 345 678"
        required
        error={errors.phone}
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

      <MultiSelect
        label="Danh mục review"
        name="reviewCategories"
        value={formData.reviewCategories}
        onChange={(v) => {
          setFormData({ ...formData, reviewCategories: v });
        }}
        options={KOC_REVIEW_CATEGORIES}
        required
        error={errors.reviewCategories}
      />

      <MultiSelect
        label="Nền tảng hoạt động"
        name="platforms"
        value={formData.platforms}
        onChange={(v) => {
          setFormData({ ...formData, platforms: v });
        }}
        options={KOC_PLATFORMS}
        required
        error={errors.platforms}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Tổng số followers"
          name="totalFollowers"
          value={formData.totalFollowers}
          onChange={(v) => {
            setFormData({ ...formData, totalFollowers: v });
          }}
          options={KOC_FOLLOWER_OPTIONS}
          required
          error={errors.totalFollowers}
        />

        <SelectField
          label="Số bài review"
          name="reviewCount"
          value={formData.reviewCount}
          onChange={(v) => {
            setFormData({ ...formData, reviewCount: v });
          }}
          options={KOC_REVIEW_COUNT_OPTIONS}
          required
          error={errors.reviewCount}
        />
      </div>

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
          placeholder="Mô tả ngắn về kinh nghiệm review (tùy chọn)"
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

      <TextField
        label="Link kênh chính"
        name="mainPlatformUrl"
        type="url"
        value={formData.mainPlatformUrl}
        onChange={(v) => {
          setFormData({ ...formData, mainPlatformUrl: v });
        }}
        placeholder="https://facebook.com/yourpage"
        required
        error={errors.mainPlatformUrl}
      />

      <SelectField
        label="Mức giá hợp tác"
        name="priceRange"
        value={formData.priceRange}
        onChange={(v) => {
          setFormData({ ...formData, priceRange: v });
        }}
        options={KOC_PRICE_OPTIONS}
        required
        error={errors.priceRange}
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
