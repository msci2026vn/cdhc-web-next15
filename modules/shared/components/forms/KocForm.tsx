"use client";

import { useState } from "react";
import {
  KOC_FOLLOWER_OPTIONS,
  KOC_PLATFORMS,
  KOC_PRICE_OPTIONS,
  KOC_REVIEW_CATEGORIES,
  KOC_REVIEW_COUNT_OPTIONS,
} from "../../data/form-options";
import type { PlatformLink } from "../ui";
import {
  LocationSelect,
  MultiSelectWithOther,
  PlatformLinks,
  SelectField,
  TextField,
} from "../ui";

export interface KocFormData {
  fullName: string;
  phone: string;
  birthDate: string;
  province: string;
  ward: string;
  reviewCategories: string[];
  reviewCategoriesOther: string;
  platformLinks: PlatformLink[];
  totalFollowers: string;
  reviewCount: string;
  bio: string;
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
    birthDate: "",
    province: "",
    ward: "",
    reviewCategories: [],
    reviewCategoriesOther: "",
    platformLinks: [{ platform: "", url: "", followers: "" }],
    totalFollowers: "",
    reviewCount: "",
    bio: "",
    priceRange: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof KocFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KocFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (formData.reviewCategories.length === 0)
      newErrors.reviewCategories = "Vui lòng chọn ít nhất 1 danh mục";

    const hasValidPlatform = formData.platformLinks.some(
      (link) => link.platform && link.url && link.followers
    );
    if (!hasValidPlatform)
      newErrors.platformLinks = "Vui lòng thêm ít nhất 1 kênh hoạt động";

    if (!formData.totalFollowers)
      newErrors.totalFollowers = "Vui lòng chọn tổng followers";
    if (!formData.reviewCount)
      newErrors.reviewCount = "Vui lòng chọn số bài review";
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
        provinceCode={formData.province}
        wardCode={formData.ward}
        onProvinceChange={(v) => {
          setFormData({ ...formData, province: v, ward: "" });
        }}
        onWardChange={(v) => {
          setFormData({ ...formData, ward: v });
        }}
        required
        error={errors.province}
      />

      <MultiSelectWithOther
        label="Danh mục review"
        name="reviewCategories"
        value={formData.reviewCategories}
        otherValue={formData.reviewCategoriesOther}
        onChange={(v) => {
          setFormData({ ...formData, reviewCategories: v });
        }}
        onOtherChange={(v) => {
          setFormData({ ...formData, reviewCategoriesOther: v });
        }}
        options={KOC_REVIEW_CATEGORIES}
        required
        error={errors.reviewCategories}
      />

      <PlatformLinks
        label="Kênh hoạt động"
        value={formData.platformLinks}
        onChange={(v) => {
          setFormData({ ...formData, platformLinks: v });
        }}
        platformOptions={KOC_PLATFORMS}
        followerOptions={KOC_FOLLOWER_OPTIONS}
        required
        error={errors.platformLinks}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Tổng followers"
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
