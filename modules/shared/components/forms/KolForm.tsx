"use client";

import { useState } from "react";
import {
  KOL_CONTENT_TYPES,
  KOL_ENGAGEMENT_OPTIONS,
  KOL_FOLLOWER_OPTIONS,
  KOL_PLATFORMS,
  KOL_PRICE_OPTIONS,
} from "../../data/form-options";
import type { PlatformLink } from "../ui";
import {
  LocationSelect,
  MultiSelectWithOther,
  PlatformLinks,
  SelectField,
  TextField,
} from "../ui";

export interface KolFormData {
  fullName: string;
  stageName: string;
  phone: string;
  birthDate: string;
  province: string;
  ward: string;
  contentTypes: string[];
  contentTypesOther: string;
  platformLinks: PlatformLink[];
  totalFollowers: string;
  engagementRate: string;
  bio: string;
  priceRange: string;
}

interface KolFormProps {
  readonly onSubmit: (data: KolFormData) => void;
  readonly isLoading?: boolean;
}

export function KolForm({ onSubmit, isLoading = false }: KolFormProps) {
  const [formData, setFormData] = useState<KolFormData>({
    fullName: "",
    stageName: "",
    phone: "",
    birthDate: "",
    province: "",
    ward: "",
    contentTypes: [],
    contentTypesOther: "",
    platformLinks: [{ platform: "", url: "", followers: "" }],
    totalFollowers: "",
    engagementRate: "",
    bio: "",
    priceRange: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof KolFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KolFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (formData.contentTypes.length === 0)
      newErrors.contentTypes = "Vui lòng chọn ít nhất 1 loại nội dung";

    const hasValidPlatform = formData.platformLinks.some(
      (link) => link.platform && link.url && link.followers
    );
    if (!hasValidPlatform)
      newErrors.platformLinks = "Vui lòng thêm ít nhất 1 kênh hoạt động";

    if (!formData.totalFollowers)
      newErrors.totalFollowers = "Vui lòng chọn tổng followers";
    if (!formData.engagementRate)
      newErrors.engagementRate = "Vui lòng chọn tỷ lệ tương tác";
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
          setFormData((prev) => ({ ...prev, fullName: v }));
        }}
        placeholder="Nguyễn Văn A"
        required
        error={errors.fullName}
      />

      <TextField
        label="Tên nghệ danh"
        name="stageName"
        value={formData.stageName}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, stageName: v }));
        }}
        placeholder="Tên kênh/nickname (tùy chọn)"
      />

      <TextField
        label="Số điện thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, phone: v }));
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
          setFormData((prev) => ({ ...prev, birthDate: v }));
        }}
      />

      <LocationSelect
        provinceCode={formData.province}
        wardCode={formData.ward}
        onProvinceChange={(v) => {
          setFormData((prev) => ({ ...prev, province: v, ward: "" }));
        }}
        onWardChange={(v) => {
          setFormData((prev) => ({ ...prev, ward: v }));
        }}
        required
        error={errors.province}
      />

      <MultiSelectWithOther
        label="Loại nội dung"
        name="contentTypes"
        value={formData.contentTypes}
        otherValue={formData.contentTypesOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, contentTypes: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, contentTypesOther: v }));
        }}
        options={KOL_CONTENT_TYPES}
        required
        error={errors.contentTypes}
      />

      <PlatformLinks
        label="Kênh hoạt động"
        value={formData.platformLinks}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, platformLinks: v }));
        }}
        platformOptions={KOL_PLATFORMS}
        followerOptions={KOL_FOLLOWER_OPTIONS}
        required
        error={errors.platformLinks}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Tổng followers"
          name="totalFollowers"
          value={formData.totalFollowers}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, totalFollowers: v }));
          }}
          options={KOL_FOLLOWER_OPTIONS}
          required
          error={errors.totalFollowers}
        />

        <SelectField
          label="Tỷ lệ tương tác"
          name="engagementRate"
          value={formData.engagementRate}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, engagementRate: v }));
          }}
          options={KOL_ENGAGEMENT_OPTIONS}
          required
          error={errors.engagementRate}
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
          placeholder="Mô tả ngắn về kênh/nội dung (tùy chọn)"
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

      <SelectField
        label="Mức giá hợp tác"
        name="priceRange"
        value={formData.priceRange}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, priceRange: v }));
        }}
        options={KOL_PRICE_OPTIONS}
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
